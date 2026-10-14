#!/usr/bin/env bash
# add-timestamps.sh — Convert webm → mp4 (if needed) and burn millisecond
# timestamps directly into the video pixels using Python + Pillow.
#
# Usage:
#   ./add-timestamps.sh <video.webm|video.mp4>
#
# Output:
#   <name>.mp4     — re-encoded mp4 (only created if input is .webm)
#   <name>_ts.mp4  — mp4 with elapsed time burned into bottom-left corner
#
# Requirements: ffmpeg, ffprobe, python3 (3.9+) + Pillow
#
# Set PYTHON=<interpreter> to override the auto-detected python.

set -euo pipefail

# Pick the first python that has Pillow. Overridable: PYTHON=python3.12 ./add-timestamps.sh …
if [[ -z "${PYTHON:-}" ]]; then
    for candidate in python3.11 python3.12 python3.13 python3; do
        if command -v "$candidate" >/dev/null 2>&1 && "$candidate" -c 'import PIL' >/dev/null 2>&1; then
            PYTHON="$candidate"; break
        fi
    done
fi
if [[ -z "${PYTHON:-}" ]]; then
    echo "No python with Pillow found. Install it, e.g.:" >&2
    echo "  python3 -m pip install Pillow" >&2
    echo "Then re-run, or set PYTHON=<interpreter> explicitly." >&2
    exit 1
fi
echo "Python : $PYTHON"

if [[ $# -lt 1 ]]; then
    echo "Usage: $0 <video.webm|video.mp4>" >&2
    exit 1
fi

INPUT="$1"
if [[ ! -f "$INPUT" ]]; then
    echo "File not found: $INPUT" >&2
    exit 1
fi

NAME="${INPUT%.*}"
EXT="${INPUT##*.}"
EXT_LOWER=$(echo "$EXT" | tr '[:upper:]' '[:lower:]')

if [[ "$EXT_LOWER" != "mp4" ]]; then
    MP4_INPUT="${NAME}.mp4"
    echo "Converting $INPUT → $MP4_INPUT ..."
    ffmpeg -y -i "$INPUT" -c:v libx264 -c:a aac "$MP4_INPUT" 2>&1 | tail -3
    INPUT="$MP4_INPUT"
fi

LOCAL_OUT="${NAME}_ts.mp4"
AUDIO_TMP=$(mktemp /tmp/ts_audio_XXXXXX.aac)
TMPPY=$(mktemp /tmp/burn_ts_XXXXXX.py)

cleanup() { rm -f "$AUDIO_TMP" "$TMPPY"; }
trap cleanup EXIT

echo "Input  : $INPUT"

# Get video dimensions and fps
VID_INFO=$(ffprobe -v error -select_streams v:0 \
    -show_entries stream=width,height,r_frame_rate \
    -of csv=p=0 "$INPUT")
WIDTH=$(echo "$VID_INFO" | cut -d, -f1)
HEIGHT=$(echo "$VID_INFO" | cut -d, -f2)
FPS_RAW=$(echo "$VID_INFO" | cut -d, -f3)
FPS=$($PYTHON -c "n,d='${FPS_RAW}'.split('/'); print(float(n)/float(d))")

echo "Size   : ${WIDTH}x${HEIGHT}  FPS: ${FPS}"

# Extract audio so we can merge back after re-encoding
echo "Extracting audio..."
ffmpeg -y -i "$INPUT" -vn -c:a copy "$AUDIO_TMP" 2>/dev/null || true

# Write the Python frame-burner script to a temp file
cat > "$TMPPY" << 'PYEOF'
import sys, signal
signal.signal(signal.SIGPIPE, signal.SIG_DFL)

from PIL import Image, ImageDraw, ImageFont

width       = int(sys.argv[1])
height      = int(sys.argv[2])
fps         = float(sys.argv[3])
frame_bytes = width * height * 3
font_size   = max(36, height // 25)

try:
    font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
except Exception:
    font = ImageFont.load_default()

stdin  = sys.stdin.buffer
stdout = sys.stdout.buffer
frame_idx = 0

try:
    while True:
        data = stdin.read(frame_bytes)
        if len(data) < frame_bytes:
            break

        elapsed_ms = int(round(frame_idx * 1000.0 / fps))
        secs       = elapsed_ms // 1000
        millis     = elapsed_ms % 1000
        label      = f"{secs:02d}.{millis:03d}"

        img  = Image.frombuffer("RGB", (width, height), data, "raw", "RGB", 0, 1)
        draw = ImageDraw.Draw(img)

        bbox = draw.textbbox((0, 0), label, font=font)
        tw   = bbox[2] - bbox[0]
        th   = bbox[3] - bbox[1]
        pad  = 8
        x    = 10
        y    = height - th - pad * 2 - 10

        draw.rectangle([x, y, x + tw + pad * 2, y + th + pad * 2], fill=(0, 0, 0))
        draw.text((x + pad, y + pad), label, font=font, fill=(255, 255, 255))

        stdout.write(img.tobytes())
        frame_idx += 1
except BrokenPipeError:
    pass
PYEOF

echo "Burning timestamps (re-encoding video)..."

set +o pipefail
ffmpeg -y -i "$INPUT" -f rawvideo -pix_fmt rgb24 -an pipe:1 2>/dev/null \
| $PYTHON "$TMPPY" "$WIDTH" "$HEIGHT" "$FPS" \
| ffmpeg -y \
    -f rawvideo -pix_fmt rgb24 -video_size "${WIDTH}x${HEIGHT}" \
    -framerate "$FPS" -i pipe:0 \
    -i "$AUDIO_TMP" \
    -c:v libx264 -preset fast -crf 18 \
    -c:a copy \
    -shortest \
    "$LOCAL_OUT" 2>&1 | grep -E 'frame=|Error|error' | tail -3
set -o pipefail

echo ""
echo "Done."
echo "  Output : ${LOCAL_OUT}"
