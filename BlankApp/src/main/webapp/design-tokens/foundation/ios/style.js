export default {
    "app-carousel": {
        "prevBtn": {
            "icon": {
                "color": "var(--wm-carousel-prev-btn-color)",
                "fontSize": "var(--wm-carousel-prev-btn-font-size)"
            },
            "root": {
                "marginLeft": "var(--wm-carousel-prev-btn-margin-left)",
                "backgroundColor": "var(--wm-carousel-prev-btn-background)",
                "rippleColor": "var(--wm-carousel-prev-btn-ripple-color)",
                "borderRadius": "var(--wm-carousel-prev-btn-border-radius)",
                "width": "var(--wm-carousel-prev-btn-width)",
                "height": "var(--wm-carousel-prev-btn-height)",
                "borderColor": "var(--wm-carousel-prev-btn-border-color)",
                "borderWidth": "var(--wm-carousel-prev-btn-border-width)"
            }
        },
        "nextBtn": {
            "icon": {
                "color": "var(--wm-carousel-next-btn-color)",
                "fontSize": "var(--wm-carousel-next-btn-font-size)"
            },
            "marginRight": "var(--wm-carousel-next-btn-margin-left)",
            "backgroundColor": "var(--wm-carousel-next-btn-background)",
            "rippleColor": "var(--wm-carousel-next-btn-ripple-color)",
            "borderRadius": "var(--wm-carousel-next-btn-border-radius)",
            "width": "var(--wm-carousel-next-btn-width)",
            "height": "var(--wm-carousel-next-btn-height)",
            "borderColor": "var(--wm-carousel-next-btn-border-color)",
            "borderWidth": "var(--wm-carousel-next-btn-border-width)",
            "root": {
                "marginRight": "var(--wm-carousel-next-btn-margin-right)",
                "backgroundColor": "var(--wm-carousel-next-btn-background)",
                "rippleColor": "var(--wm-carousel-next-btn-ripple-color)",
                "borderRadius": "var(--wm-carousel-next-btn-border-radius)",
                "width": "var(--wm-carousel-next-btn-width)",
                "height": "var(--wm-carousel-next-btn-height)",
                "borderColor": "var(--wm-carousel-next-btn-border-color)",
                "borderWidth": "var(--wm-carousel-next-btn-border-width)"
            }
        },
        "dotsWrapperStyle": {
            "backgroundColor": "var(--wm-carousel-dots-wrapper-background-color)",
            "opacity": "var(--wm-carousel-dots-wrapper-opacity)",
            "padding": "var(--wm-carousel-dots-wrapper-padding)"
        },
        "dotStyle": {
            "backgroundColor": "var(--wm-carousel-dots-background)",
            "opacity": "var(--wm-carousel-dots-opacity)",
            "width": "var(--wm-carousel-dots-width)",
            "height": "var(--wm-carousel-dots-height)",
            "borderRadius": "var(--wm-carousel-dots-border-radius)",
            "borderColor": "var(--wm-carousel-dots-border-color)",
            "margin": "var(--wm-carousel-dots-margin)",
            "borderWidth": "var(--wm-carousel-dots-border-width)"
        },
        "activeDotStyle": {
            "backgroundColor": "var(--wm-carousel-dots-background)",
            "--wm-carousel-dots-opacity": 1,
            "--wm-carousel-dots-width": 10,
            "--wm-carousel-dots-height": 10,
            "--wm-carousel-dots-border-radius": 5,
            "--wm-carousel-slide-width": "100%",
            "--wm-carousel-slide-border-color": "transparent",
            "--wm-carousel-slide-background": "transparent",
            "--wm-carousel-dots-background": "var(--wm-color-primary-container)",
            "--wm-carousel-dots-border-color": "var(--wm-color-primary-container)",
            "--wm-carousel-dots-border-width": "var(--wm-border-width-base)",
            "--wm-carousel-dots-margin": "var(--wm-space-0) var(--wm-radius-xxs)",
            "--wm-carousel-slide-padding": "var(--wm-space-0) var(--wm-space-4)",
            "--wm-carousel-slide-border-radius": "var(--wm-radius-none)",
            "--wm-carousel-slide-border-width": "var(--wm-border-width-base)",
            "--wm-carousel-slide-border-style": "var(--wm-border-style-solid)",
            "opacity": "var(--wm-carousel-dots-opacity)",
            "width": "var(--wm-carousel-dots-width)",
            "height": "var(--wm-carousel-dots-height)",
            "borderRadius": "var(--wm-carousel-dots-border-radius)",
            "borderColor": "var(--wm-carousel-dots-border-color)",
            "margin": "var(--wm-carousel-dots-margin)",
            "borderWidth": "var(--wm-carousel-dots-border-width)"
        },
        "activeSlide": {
            "--wm-carousel-dots-opacity": 1,
            "--wm-carousel-dots-width": 10,
            "--wm-carousel-dots-height": 10,
            "--wm-carousel-dots-border-radius": 5,
            "--wm-carousel-slide-width": "100%",
            "--wm-carousel-slide-border-color": "transparent",
            "--wm-carousel-slide-background": "transparent",
            "--wm-carousel-dots-background": "var(--wm-color-primary-container)",
            "--wm-carousel-dots-border-color": "var(--wm-color-primary-container)",
            "--wm-carousel-dots-border-width": "var(--wm-border-width-base)",
            "--wm-carousel-dots-margin": "var(--wm-space-0) var(--wm-radius-xxs)",
            "--wm-carousel-slide-padding": "var(--wm-space-0) var(--wm-space-4)",
            "--wm-carousel-slide-border-radius": "var(--wm-radius-none)",
            "--wm-carousel-slide-border-width": "var(--wm-border-width-base)",
            "--wm-carousel-slide-border-style": "var(--wm-border-style-solid)",
            "width": "var(--wm-carousel-slide-width)",
            "padding": "var(--wm-carousel-slide-padding)",
            "borderRadius": "var(--wm-carousel-slide-border-radius)",
            "borderColor": "var(--wm-carousel-slide-border-color)",
            "borderWidth": "var(--wm-carousel-slide-border-width)",
            "borderStyle": "var(--wm-carousel-slide-border-style)",
            "backgroundColor": "var(--wm-carousel-slide-background)"
        },
        "root": {
            "rippleColor": "var(--wm-carousel-ripple-color)"
        },
        "slide": {
            "width": "var(--wm-carousel-slide-width)",
            "padding": "var(--wm-carousel-slide-padding)",
            "borderRadius": "var(--wm-carousel-slide-border-radius)",
            "borderColor": "var(--wm-carousel-slide-border-color)",
            "borderWidth": "var(--wm-carousel-slide-border-width)",
            "borderStyle": "var(--wm-carousel-slide-border-style)",
            "backgroundColor": "var(--wm-carousel-slide-background)"
        },
        "firstSlide": {
            "padding": "var(--wm-carousel-first-slide-padding)",
            "borderRadius": "var(--wm-carousel-first-slide-border-radius)",
            "borderColor": "var(--wm-carousel-first-slide-border-color)",
            "borderWidth": "var(--wm-carousel-first-slide-border-width)",
            "borderStyle": "var(--wm-carousel-first-slide-border-style)",
            "backgroundColor": "var(--wm-carousel-first-slide-background)"
        },
        "lastSlide": {
            "padding": "var(--wm-carousel-last-slide-padding)",
            "borderRadius": "var(--wm-carousel-last-slide-border-radius)",
            "borderColor": "var(--wm-carousel-last-slide-border-color)",
            "borderWidth": "var(--wm-carousel-last-slide-border-width)",
            "borderStyle": "var(--wm-carousel-last-slide-border-style)",
            "backgroundColor": "var(--wm-carousel-last-slide-background)"
        },
        "dotSkeleton": {
            "width": "var(--wm-carousel-dots-width)",
            "height": "var(--wm-carousel-dots-height)",
            "borderRadius": "var(--wm-carousel-dots-radius)",
            "backgroundColor": "var(--wm-carousel-dots-background)",
            "opacity": "var(--wm-carousel-dots-opacity)"
        }
    },
    "app-login": {
        "errorMsgStyles": {
            "color": "var(--wm-login-error-text-color)",
            "backgroundColor": "var(--wm-login-error-background-color)",
            "borderColor": "var(--wm-login-error-border-color)",
            "borderRadius": "var(--wm-login-error-border-radius)"
        },
        "formStyles": {
            "padding": "var(--wm-login-form-padding)"
        }
    },
    "app-webview": {
        "root": {
            "backgroundColor": "var(--wm-webview-background-color)",
            "padding": "var(--wm-webview-padding)"
        }
    },
    "app-anchor": {
        "text": {
            "color": "var(--wm-anchor-color)",
            "padding": "var(--wm-anchor-text-padding)",
            "fontSize": "var(--wm-anchor-font-size)",
            "fontFamily": "var(--wm-anchor-font-family)",
            "fontWeight": "var(--wm-anchor-font-weight)",
            "lineHeight": "var(--wm-anchor-line-height)",
            "letterSpacing": "var(--wm-anchor-letter-spacing)",
            "textTransform": "var(--wm-anchor-text-transform)",
            "textDecoration": "var(--wm-anchor-text-decoration)",
            "textDecorationLine": "var(--wm-anchor-text-decoration)"
        },
        "icon": {
            "root": {
                "color": "#151420",
                "minWidth": "var(--wm-anchor-icon-size)",
                "width": "var(--wm-anchor-icon-size)",
                "height": "var(--wm-anchor-icon-size)"
            },
            "image": {
                "width": "var(--wm-anchor-image-size)",
                "height": "var(--wm-anchor-image-size)",
                "borderRadius": "var(--wm-anchor-image-radius)"
            },
            "icon": {
                "color": "var(--wm-anchor-color)",
                "fontSize": "var(--wm-anchor-icon-size)",
                "minWidth": "var(--wm-anchor-icon-size)",
                "width": "var(--wm-anchor-icon-size)",
                "height": "var(--wm-anchor-icon-size)",
                "lineHeight": "var(--wm-anchor-icon-size)"
            }
        },
        "root": {
            "color": "var(--wm-anchor-color)",
            "gap": "var(--wm-anchor-gap)"
        }
    },
    "link-primary": {
        "text": {
            "color": "#4263eb"
        },
        "icon": {
            "root": {
                "color": "#4263eb"
            }
        },
        "badge": {
            "backgroundColor": "rgba(66,99,235,.2)",
            "color": "#4263eb"
        }
    },
    "link-secondary": {
        "text": {
            "color": "#6c757d"
        },
        "icon": {
            "root": {
                "color": "#6c757d"
            }
        },
        "badge": {
            "backgroundColor": "rgba(108,117,125,.2)",
            "color": "#6c757d"
        }
    },
    "link-success": {
        "text": {
            "color": "#28a745"
        },
        "icon": {
            "root": {
                "color": "#28a745"
            }
        },
        "badge": {
            "backgroundColor": "rgba(40,167,69,.2)",
            "color": "#28a745"
        }
    },
    "link-danger": {
        "text": {
            "color": "#dc3545"
        },
        "icon": {
            "root": {
                "color": "#dc3545"
            }
        },
        "badge": {
            "backgroundColor": "rgba(220,53,69,.2)",
            "color": "#dc3545"
        }
    },
    "link-warning": {
        "text": {
            "color": "#ffc107"
        },
        "icon": {
            "root": {
                "color": "#ffc107"
            }
        },
        "badge": {
            "backgroundColor": "rgba(255,193,7,.2)",
            "color": "#ffc107"
        }
    },
    "link-info": {
        "text": {
            "color": "#17a2b8"
        },
        "icon": {
            "root": {
                "color": "#17a2b8"
            }
        },
        "badge": {
            "backgroundColor": "rgba(23,162,184,.2)",
            "color": "#17a2b8"
        }
    },
    "link-light": {
        "text": {
            "color": "#fff"
        },
        "icon": {
            "root": {
                "color": "#fff"
            }
        },
        "badge": {
            "backgroundColor": "rgba(255,255,255,.2)",
            "color": "#fff"
        }
    },
    "link-dark": {
        "text": {
            "color": "#000"
        },
        "icon": {
            "root": {
                "color": "#000"
            }
        },
        "badge": {
            "backgroundColor": "rgba(0,0,0,.2)",
            "color": "#000"
        }
    },
    "app-button": {
        "badge": {
            "backgroundColor": "#6c757d",
            "color": "#fff",
            "borderColor": "#fff"
        },
        "root": {
            "flexDirection": "column",
            "overflow": "hidden",
            "backgroundColor": "var(--wm-btn-background)",
            "borderWidth": "var(--wm-btn-border-width)",
            "borderStyle": "var(--wm-btn-border-style)",
            "borderColor": "var(--wm-btn-border-color)",
            "borderRadius": "var(--wm-btn-radius)",
            "rippleColor": "var(--wm-btn-ripple-color)",
            "boxShadow": "var(--wm-btn-shadow)",
            "minWidth": "var(--wm-btn-min-width)",
            "minHeight": "var(--wm-btn-min-height)",
            "padding": "var(--wm-btn-padding)",
            "cursor": "var(--wm-btn-cursor)",
            "color": "var(--wm-btn-color)",
            "opacity": "var(--wm-btn-opacity)"
        },
        "text": {
            "whiteSpace": "nowrap",
            "fontSize": "var(--wm-btn-font-size)",
            "fontFamily": "var(--wm-btn-font-family)",
            "fontWeight": "var(--wm-btn-font-weight)",
            "lineHeight": "var(--wm-btn-line-height)",
            "letterSpacing": "var(--wm-btn-letter-spacing)",
            "textTransform": "var(--wm-btn-text-transform)",
            "color": "var(--wm-btn-color)"
        },
        "content": {
            "display": "flex",
            "flexGrow": 1,
            "flexDirection": "row",
            "alignItems": "center",
            "justifyContent": "center",
            "cursor": "pointer",
            "gap": "var(--wm-btn-gap)",
            "minHeight": "var(--wm-btn-min-height)"
        },
        "icon": {
            "padding": "var(--wm-btn-icon-padding)",
            "root": {
                "color": "var(--wm-btn-icon-color)"
            },
            "icon": {
                "minWidth": "var(--wm-btn-icon-size)",
                "width": "var(--wm-btn-icon-size)",
                "height": "var(--wm-btn-icon-size)",
                "fontSize": "var(--wm-btn-icon-size)",
                "lineHeight": "var(--wm-btn-icon-size)"
            }
        },
        "skeleton": {
            "width": "var(--wm-btn-skeleton-width)",
            "height": "var(--wm-btn-skeleton-height)"
        }
    },
    "btn-default": {
        "root": {
            "borderColor": "#ccc",
            "backgroundColor": "#fff"
        },
        "text": {
            "color": "#4263eb"
        },
        "badge": {
            "backgroundColor": "#4263eb",
            "color": "#fff",
            "borderColor": "#fff"
        },
        "icon": {
            "root": {
                "color": "var(--wm-color-black)"
            }
        }
    },
    "btn-info": {
        "root": {
            "borderColor": "#17a2b8",
            "backgroundColor": "#17a2b8"
        },
        "text": {
            "color": "#fff"
        },
        "badge": {
            "backgroundColor": "#fff",
            "color": "#17a2b8",
            "borderColor": "#17a2b8"
        },
        "icon": {
            "root": {
                "color": "#fff"
            }
        }
    },
    "btn-primary": {
        "root": {
            "borderColor": "#4263eb",
            "backgroundColor": "#4263eb"
        },
        "text": {
            "color": "#fff"
        },
        "badge": {
            "backgroundColor": "#fff",
            "color": "#4263eb",
            "borderColor": "#4263eb"
        },
        "icon": {
            "root": {
                "color": "#fff"
            }
        }
    },
    "btn-secondary": {
        "root": {
            "borderColor": "#6c757d",
            "backgroundColor": "#fff"
        },
        "text": {
            "color": "#6c757d"
        },
        "badge": {
            "backgroundColor": "#6c757d",
            "color": "#fff",
            "borderColor": "#fff"
        },
        "icon": {
            "root": {
                "color": "#6c757d"
            }
        }
    },
    "btn-danger": {
        "root": {
            "borderColor": "#dc3545",
            "backgroundColor": "#dc3545"
        },
        "text": {
            "color": "#fff"
        },
        "badge": {
            "backgroundColor": "#fff",
            "color": "#dc3545",
            "borderColor": "#dc3545"
        },
        "icon": {
            "root": {
                "color": "#fff"
            }
        }
    },
    "btn-success": {
        "root": {
            "borderColor": "#28a745",
            "backgroundColor": "#28a745"
        },
        "text": {
            "color": "#fff"
        },
        "badge": {
            "backgroundColor": "#fff",
            "color": "#28a745",
            "borderColor": "#28a745"
        },
        "icon": {
            "root": {
                "color": "#fff"
            }
        }
    },
    "btn-warning": {
        "root": {
            "borderColor": "#ffc107",
            "backgroundColor": "#ffc107"
        },
        "text": {
            "color": "#fff"
        },
        "badge": {
            "backgroundColor": "#fff",
            "color": "#ffc107",
            "borderColor": "#ffc107"
        },
        "icon": {
            "root": {
                "color": "#fff"
            }
        }
    },
    "btn-link": {
        "root": {
            "borderColor": "transparent",
            "backgroundColor": "transparent"
        },
        "text": {
            "color": "#4263eb"
        },
        "badge": {
            "backgroundColor": "#4263eb",
            "color": "transparent",
            "borderColor": "transparent"
        },
        "icon": {
            "root": {
                "color": "#4263eb"
            }
        }
    },
    "btn-dark": {
        "root": {
            "borderColor": "#000",
            "backgroundColor": "#000"
        },
        "text": {
            "color": "#fff"
        },
        "badge": {
            "backgroundColor": "#fff",
            "color": "#000",
            "borderColor": "#000"
        },
        "icon": {
            "root": {
                "color": "#fff"
            }
        }
    },
    "btn-light": {
        "root": {
            "borderColor": "#fff",
            "backgroundColor": "#fff"
        },
        "text": {
            "color": "#000"
        },
        "badge": {
            "backgroundColor": "#000",
            "color": "#fff",
            "borderColor": "#fff"
        },
        "icon": {
            "root": {
                "color": "#000"
            }
        }
    },
    "btn-block": {
        "root": {
            "width": "100%"
        }
    },
    "app-button-disabled": {
        "root": {
            "color": "var(--wm-btn-color)",
            "backgroundColor": "var(--wm-btn-background)",
            "borderColor": "var(--wm-btn-border-color)",
            "opacity": "var(--wm-btn-opacity)",
            "cursor": "var(--wm-btn-cursor)",
            "boxShadow": "var(--wm-btn-shadow)"
        },
        "--wm-btn-opacity": 0.38,
        "--wm-btn-cursor": "not-allowed",
        "--wm-btn-shadow": "none",
        "--wm-btn-color": "var(--wm-color-on-surface)",
        "--wm-btn-background": "var(--wm-color-surface-container-highest)",
        "--wm-btn-border-color": "var(--wm-color-surface-container-highest)"
    },
    "btn-filled-default": {
        "--wm-btn-background": "var(--wm-color-surface)",
        "--wm-btn-color": "var(--wm-color-on-surface)",
        "--wm-btn-border-color": "var(--wm-color-surface-container-highest)"
    },
    "btn-filled-primary": {
        "--wm-btn-background": "var(--wm-color-primary)",
        "--wm-btn-color": "var(--wm-color-on-primary)",
        "--wm-btn-border-color": "var(--wm-color-primary)"
    },
    "btn-filled-secondary": {
        "--wm-btn-background": "var(--wm-color-secondary)",
        "--wm-btn-color": "var(--wm-color-on-secondary)",
        "--wm-btn-border-color": "var(--wm-color-secondary)"
    },
    "btn-filled-tertiary": {
        "--wm-btn-background": "var(--wm-color-tertiary)",
        "--wm-btn-color": "var(--wm-color-on-tertiary)",
        "--wm-btn-border-color": "var(--wm-color-tertiary)"
    },
    "btn-filled-success": {
        "--wm-btn-background": "var(--wm-color-success)",
        "--wm-btn-color": "var(--wm-color-on-success)",
        "--wm-btn-border-color": "var(--wm-color-success)"
    },
    "btn-filled-info": {
        "--wm-btn-background": "var(--wm-color-info)",
        "--wm-btn-color": "var(--wm-color-on-info)",
        "--wm-btn-border-color": "var(--wm-color-info)"
    },
    "btn-filled-warning": {
        "--wm-btn-background": "var(--wm-color-warning)",
        "--wm-btn-color": "var(--wm-color-on-warning)",
        "--wm-btn-border-color": "var(--wm-color-warning)"
    },
    "btn-filled-danger": {
        "--wm-btn-background": "var(--wm-color-error)",
        "--wm-btn-color": "var(--wm-color-on-error)",
        "--wm-btn-border-color": "var(--wm-color-error)"
    },
    "btn-outlined-default": {
        "--wm-btn-background": "transparent",
        "--wm-btn-color": "var(--wm-color-on-surface)",
        "--wm-btn-border-color": "var(--wm-color-surface-container-highest)"
    },
    "btn-outlined-primary": {
        "--wm-btn-background": "transparent",
        "--wm-btn-color": "var(--wm-color-primary)",
        "--wm-btn-border-color": "var(--wm-color-primary)"
    },
    "btn-outlined-secondary": {
        "--wm-btn-background": "transparent",
        "--wm-btn-color": "var(--wm-color-secondary)",
        "--wm-btn-border-color": "var(--wm-color-secondary)"
    },
    "btn-outlined-tertiary": {
        "--wm-btn-background": "transparent",
        "--wm-btn-color": "var(--wm-color-tertiary)",
        "--wm-btn-border-color": "var(--wm-color-tertiary)"
    },
    "btn-outlined-success": {
        "--wm-btn-background": "transparent",
        "--wm-btn-color": "var(--wm-color-success)",
        "--wm-btn-border-color": "var(--wm-color-success)"
    },
    "btn-outlined-info": {
        "--wm-btn-background": "transparent",
        "--wm-btn-color": "var(--wm-color-info)",
        "--wm-btn-border-color": "var(--wm-color-info)"
    },
    "btn-outlined-warning": {
        "--wm-btn-background": "transparent",
        "--wm-btn-color": "var(--wm-color-warning)",
        "--wm-btn-border-color": "var(--wm-color-warning)"
    },
    "btn-outlined-danger": {
        "--wm-btn-background": "transparent",
        "--wm-btn-color": "var(--wm-color-error)",
        "--wm-btn-border-color": "var(--wm-color-error)"
    },
    "btn-outlined-error": {
        "--wm-btn-background": "transparent",
        "--wm-btn-color": "var(--wm-color-error)",
        "--wm-btn-border-color": "var(--wm-color-error)"
    },
    "btn-text-default": {
        "--wm-btn-background": "none",
        "--wm-btn-border-color": "transparent",
        "--wm-btn-padding": "var(--wm-space-2) var(--wm-space-3)",
        "--wm-btn-color": "var(--wm-color-on-surface)"
    },
    "btn-text-primary": {
        "--wm-btn-background": "none",
        "--wm-btn-border-color": "transparent",
        "--wm-btn-padding": "var(--wm-space-2) var(--wm-space-3)",
        "--wm-btn-color": "var(--wm-color-primary)"
    },
    "btn-text-secondary": {
        "--wm-btn-background": "none",
        "--wm-btn-border-color": "transparent",
        "--wm-btn-padding": "var(--wm-space-2) var(--wm-space-3)",
        "--wm-btn-color": "var(--wm-color-secondary)"
    },
    "btn-text-tertiary": {
        "--wm-btn-background": "none",
        "--wm-btn-border-color": "transparent",
        "--wm-btn-padding": "var(--wm-space-2) var(--wm-space-3)",
        "--wm-btn-color": "var(--wm-color-tertiary)"
    },
    "btn-text-success": {
        "--wm-btn-background": "none",
        "--wm-btn-border-color": "transparent",
        "--wm-btn-padding": "var(--wm-space-2) var(--wm-space-3)",
        "--wm-btn-color": "var(--wm-color-success)"
    },
    "btn-text-info": {
        "--wm-btn-background": "none",
        "--wm-btn-border-color": "transparent",
        "--wm-btn-padding": "var(--wm-space-2) var(--wm-space-3)",
        "--wm-btn-color": "var(--wm-color-info)"
    },
    "btn-text-warning": {
        "--wm-btn-background": "none",
        "--wm-btn-border-color": "transparent",
        "--wm-btn-padding": "var(--wm-space-2) var(--wm-space-3)",
        "--wm-btn-color": "var(--wm-color-warning)"
    },
    "btn-text-danger": {
        "--wm-btn-background": "none",
        "--wm-btn-border-color": "transparent",
        "--wm-btn-padding": "var(--wm-space-2) var(--wm-space-3)",
        "--wm-btn-color": "var(--wm-color-error)"
    },
    "btn-text-error": {
        "--wm-btn-background": "none",
        "--wm-btn-border-color": "transparent",
        "--wm-btn-padding": "var(--wm-space-2) var(--wm-space-3)",
        "--wm-btn-color": "var(--wm-color-error)"
    },
    "btn-standard-default": {
        "--wm-btn-background": "none",
        "--wm-btn-border-color": "transparent",
        "--wm-btn-padding": "var(--wm-space-2) var(--wm-space-3)",
        "--wm-btn-color": "var(--wm-color-on-surface)"
    },
    "btn-standard-primary": {
        "--wm-btn-background": "none",
        "--wm-btn-border-color": "transparent",
        "--wm-btn-padding": "var(--wm-space-2) var(--wm-space-3)",
        "--wm-btn-color": "var(--wm-color-primary)"
    },
    "btn-standard-secondary": {
        "--wm-btn-background": "none",
        "--wm-btn-border-color": "transparent",
        "--wm-btn-padding": "var(--wm-space-2) var(--wm-space-3)",
        "--wm-btn-color": "var(--wm-color-secondary)"
    },
    "btn-standard-tertiary": {
        "--wm-btn-background": "none",
        "--wm-btn-border-color": "transparent",
        "--wm-btn-padding": "var(--wm-space-2) var(--wm-space-3)",
        "--wm-btn-color": "var(--wm-color-tertiary)"
    },
    "btn-standard-success": {
        "--wm-btn-background": "none",
        "--wm-btn-border-color": "transparent",
        "--wm-btn-padding": "var(--wm-space-2) var(--wm-space-3)",
        "--wm-btn-color": "var(--wm-color-success)"
    },
    "btn-standard-info": {
        "--wm-btn-background": "none",
        "--wm-btn-border-color": "transparent",
        "--wm-btn-padding": "var(--wm-space-2) var(--wm-space-3)",
        "--wm-btn-color": "var(--wm-color-info)"
    },
    "btn-standard-warning": {
        "--wm-btn-background": "none",
        "--wm-btn-border-color": "transparent",
        "--wm-btn-padding": "var(--wm-space-2) var(--wm-space-3)",
        "--wm-btn-color": "var(--wm-color-warning)"
    },
    "btn-standard-danger": {
        "--wm-btn-background": "none",
        "--wm-btn-border-color": "transparent",
        "--wm-btn-padding": "var(--wm-space-2) var(--wm-space-3)",
        "--wm-btn-color": "var(--wm-color-error)"
    },
    "btn-standard-error": {
        "--wm-btn-background": "none",
        "--wm-btn-border-color": "transparent",
        "--wm-btn-padding": "var(--wm-space-2) var(--wm-space-3)",
        "--wm-btn-color": "var(--wm-color-error)"
    },
    "btn-icon": {
        "--wm-btn-min-height": 40,
        "--wm-btn-min-width": 40,
        "--wm-btn-padding": "var(--wm-space-0)",
        "--wm-btn-icon-size": "var(--wm-icon-size-md)"
    },
    "btn-elevated": {
        "--wm-btn-shadow": "var(--wm-elevation-shadow-1)"
    },
    "btn-fab": {
        "--wm-btn-min-height": 56,
        "--wm-btn-min-width": 56,
        "--wm-btn-border-radius": 16,
        "--wm-btn-shadow": "var(--wm-elevation-shadow-1)"
    },
    "app-buttongroup": {
        "root": {
            "borderColor": "var(--wm-button-group-border-color)",
            "backgroundColor": "#fff",
            "flexDirection": "row",
            "borderRadius": "var(--wm-button-group-radius)",
            "borderWidth": "var(--wm-button-group-border-width)",
            "borderStyle": "var(--wm-button-group-border-style)"
        }
    },
    "btn-group-child": {
        "borderColor": "var(--wm-btn-border-color)",
        "backgroundColor": "var(--wm-btn-background)",
        "borderWidth": "var(--wm-btn-border-width)"
    },
    "btn-group-first-child": {
        "root": {
            "borderColor": "var(--wm-btn-border-color)",
            "backgroundColor": "var(--wm-btn-background)",
            "borderWidth": "var(--wm-btn-border-width)",
            "borderTopLeftRadius": "var(--wm-btn-radius)",
            "borderBottomLeftRadius": "var(--wm-btn-radius)"
        }
    },
    "btn-group-child-vertical": {
        "alignSelf": "stretch"
    },
    "btn-group-vertical": {
        "root": {
            "flexDirection": "column",
            "borderRadius": "var(--wm-button-group-radius)"
        }
    },
    "btn-group-last-child": {
        "root": {
            "backgroundColor": "var(--wm-btn-background)",
            "borderWidth": "var(--wm-btn-border-width)",
            "borderColor": "var(--wm-btn-border-color)",
            "borderTopRightRadius": "var(--wm-btn-radius)",
            "borderBottomRightRadius": "var(--wm-btn-radius)"
        }
    },
    "app-icon": {
        "root": {
            "rippleColor": "transparent",
            "gap": "var(--wm-icon-gap)"
        },
        "text": {
            "marginTop": 0,
            "marginRight": 0,
            "marginBottom": 0,
            "marginLeft": 0,
            "fontSize": "var(--wm-icon-font-size)",
            "color": "var(--wm-icon-color)"
        },
        "icon": {
            "paddingTop": 0,
            "paddingRight": 0,
            "paddingBottom": 0,
            "paddingLeft": 0,
            "minWidth": "var(--wm-icon-min-width)",
            "width": "var(--wm-icon-width)",
            "height": "var(--wm-icon-height)",
            "fontSize": "var(--wm-icon-font-size)",
            "lineHeight": "var(--wm-icon-font-size)"
        }
    },
    "fa-xs": {
        "--wm-icon-font-size": "var(--wm-icon-size-xs)",
        "--wm-icon-min-width": "var(--wm-icon-size-xs)",
        "--wm-icon-width": "var(--wm-icon-size-xs)",
        "--wm-icon-height": "var(--wm-icon-size-xs)"
    },
    "fa-sm": {
        "--wm-icon-font-size": "var(--wm-icon-size-sm)",
        "--wm-icon-min-width": "var(--wm-icon-size-sm)",
        "--wm-icon-width": "var(--wm-icon-size-sm)",
        "--wm-icon-height": "var(--wm-icon-size-sm)"
    },
    "fa-lg": {
        "--wm-icon-font-size": "var(--wm-icon-size-lg)",
        "--wm-icon-min-width": "var(--wm-icon-size-lg)",
        "--wm-icon-width": "var(--wm-icon-size-lg)",
        "--wm-icon-height": "var(--wm-icon-size-lg)"
    },
    "fa-2x": {
        "--wm-icon-font-size": "var(--wm-icon-size-2x)",
        "--wm-icon-min-width": "var(--wm-icon-size-2x)",
        "--wm-icon-width": "var(--wm-icon-size-2x)",
        "--wm-icon-height": "var(--wm-icon-size-2x)"
    },
    "fa-3x": {
        "--wm-icon-font-size": "var(--wm-icon-size-3x)",
        "--wm-icon-min-width": "var(--wm-icon-size-3x)",
        "--wm-icon-width": "var(--wm-icon-size-3x)",
        "--wm-icon-height": "var(--wm-icon-size-3x)"
    },
    "fa-4x": {
        "--wm-icon-font-size": "var(--wm-icon-size-4x)",
        "--wm-icon-min-width": "var(--wm-icon-size-4x)",
        "--wm-icon-width": "var(--wm-icon-size-4x)",
        "--wm-icon-height": "var(--wm-icon-size-4x)"
    },
    "fa-5x": {
        "--wm-icon-font-size": "var(--wm-icon-size-5x)",
        "--wm-icon-min-width": "var(--wm-icon-size-5x)",
        "--wm-icon-width": "var(--wm-icon-size-5x)",
        "--wm-icon-height": "var(--wm-icon-size-5x)"
    },
    "app-label": {
        "root": {
            "color": "#888",
            "margin": "var(--wm-space-0)",
            "padding": "var(--wm-label-padding)",
            "backgroundColor": "var(--wm-label-background-color)",
            "borderRadius": "var(--wm-label-border-radius)",
            "borderWidth": "var(--wm-label-border-width)",
            "borderStyle": "var(--wm-label-border-style)",
            "borderColor": "var(--wm-label-border-color)"
        },
        "asterisk": {
            "color": "var(--wm-label-asterisk-color)"
        },
        "text": {
            "fontSize": "var(--wm-label-font-size)",
            "fontWeight": "var(--wm-label-font-weight)",
            "fontFamily": "var(--wm-label-font-family)",
            "color": "var(--wm-label-color)"
        }
    },
    "label-danger": {
        "root": {
            "backgroundColor": "var(--wm-label-background-color)",
            "padding": "var(--wm-label-padding)",
            "borderRadius": "var(--wm-label-border-radius)"
        },
        "text": {
            "color": "var(--wm-label-color)",
            "fontWeight": "var(--wm-label-font-weight)",
            "lineHeight": "var(--wm-label-line-height)",
            "letterSpacing": "var(--wm-label-letter-spacing)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "--wm-label-border-radius": 6,
        "--wm-label-padding": "var(--wm-space-4) var(--wm-space-8)",
        "--wm-label-font-weight": "var(--wm-font-weight-700)",
        "--wm-label-background-color": "var(--wm-color-error)",
        "--wm-label-color": "var(--wm-color-on-error)"
    },
    "label-primary": {
        "root": {
            "backgroundColor": "var(--wm-label-background-color)",
            "padding": "var(--wm-label-padding)",
            "borderRadius": "var(--wm-label-border-radius)"
        },
        "text": {
            "color": "var(--wm-label-color)",
            "fontWeight": "var(--wm-label-font-weight)",
            "lineHeight": "var(--wm-label-line-height)",
            "letterSpacing": "var(--wm-label-letter-spacing)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "--wm-label-border-radius": 6,
        "--wm-label-padding": "var(--wm-space-4) var(--wm-space-8)",
        "--wm-label-font-weight": "var(--wm-font-weight-700)",
        "--wm-label-background-color": "var(--wm-color-primary)",
        "--wm-label-color": "var(--wm-color-on-primary)"
    },
    "label-default": {
        "root": {
            "backgroundColor": "#888"
        },
        "text": {
            "color": "#fff"
        }
    },
    "label-success": {
        "root": {
            "backgroundColor": "var(--wm-label-background-color)",
            "padding": "var(--wm-label-padding)",
            "borderRadius": "var(--wm-label-border-radius)"
        },
        "text": {
            "color": "var(--wm-label-color)",
            "fontWeight": "var(--wm-label-font-weight)",
            "lineHeight": "var(--wm-label-line-height)",
            "letterSpacing": "var(--wm-label-letter-spacing)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "--wm-label-border-radius": 6,
        "--wm-label-padding": "var(--wm-space-4) var(--wm-space-8)",
        "--wm-label-font-weight": "var(--wm-font-weight-700)",
        "--wm-label-background-color": "var(--wm-color-success)",
        "--wm-label-color": "var(--wm-color-on-success)"
    },
    "label-warning": {
        "root": {
            "backgroundColor": "var(--wm-label-background-color)",
            "padding": "var(--wm-label-padding)",
            "borderRadius": "var(--wm-label-border-radius)"
        },
        "text": {
            "color": "var(--wm-label-color)",
            "fontWeight": "var(--wm-label-font-weight)",
            "lineHeight": "var(--wm-label-line-height)",
            "letterSpacing": "var(--wm-label-letter-spacing)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "--wm-label-border-radius": 6,
        "--wm-label-padding": "var(--wm-space-4) var(--wm-space-8)",
        "--wm-label-font-weight": "var(--wm-font-weight-700)",
        "--wm-label-background-color": "var(--wm-color-warning)",
        "--wm-label-color": "var(--wm-color-on-warning)"
    },
    "label-info": {
        "root": {
            "backgroundColor": "var(--wm-label-background-color)",
            "padding": "var(--wm-label-padding)",
            "borderRadius": "var(--wm-label-border-radius)"
        },
        "text": {
            "color": "var(--wm-label-color)",
            "fontWeight": "var(--wm-label-font-weight)",
            "lineHeight": "var(--wm-label-line-height)",
            "letterSpacing": "var(--wm-label-letter-spacing)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "--wm-label-border-radius": 6,
        "--wm-label-padding": "var(--wm-space-4) var(--wm-space-8)",
        "--wm-label-font-weight": "var(--wm-font-weight-700)",
        "--wm-label-background-color": "var(--wm-color-info)",
        "--wm-label-color": "var(--wm-color-on-info)"
    },
    "text-danger": {
        "text": {
            "color": "var(--wm-label-color)",
            "lineHeight": "var(--wm-label-line-height)",
            "letterSpacing": "var(--wm-label-letter-spacing)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "root": {
            "backgroundColor": "var(--wm-label-background-color)",
            "borderRadius": "var(--wm-label-border-radius)",
            "borderWidth": "var(--wm-label-border-width)",
            "borderStyle": "var(--wm-label-border-style)",
            "borderColor": "var(--wm-label-border-color)",
            "padding": "var(--wm-label-padding)"
        },
        "--wm-label-color": "var(--wm-color-error)"
    },
    "text-primary": {
        "text": {
            "color": "var(--wm-label-color)",
            "lineHeight": "var(--wm-label-line-height)",
            "letterSpacing": "var(--wm-label-letter-spacing)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "root": {
            "backgroundColor": "var(--wm-label-background-color)",
            "borderRadius": "var(--wm-label-border-radius)",
            "borderWidth": "var(--wm-label-border-width)",
            "borderStyle": "var(--wm-label-border-style)",
            "borderColor": "var(--wm-label-border-color)",
            "padding": "var(--wm-label-padding)"
        },
        "--wm-label-color": "var(--wm-color-primary)"
    },
    "text-success": {
        "text": {
            "color": "var(--wm-label-color)",
            "lineHeight": "var(--wm-label-line-height)",
            "letterSpacing": "var(--wm-label-letter-spacing)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "root": {
            "backgroundColor": "var(--wm-label-background-color)",
            "borderRadius": "var(--wm-label-border-radius)",
            "borderWidth": "var(--wm-label-border-width)",
            "borderStyle": "var(--wm-label-border-style)",
            "borderColor": "var(--wm-label-border-color)",
            "padding": "var(--wm-label-padding)"
        },
        "--wm-label-color": "var(--wm-color-success)"
    },
    "text-warning": {
        "text": {
            "color": "var(--wm-label-color)",
            "lineHeight": "var(--wm-label-line-height)",
            "letterSpacing": "var(--wm-label-letter-spacing)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "root": {
            "backgroundColor": "var(--wm-label-background-color)",
            "borderRadius": "var(--wm-label-border-radius)",
            "borderWidth": "var(--wm-label-border-width)",
            "borderStyle": "var(--wm-label-border-style)",
            "borderColor": "var(--wm-label-border-color)",
            "padding": "var(--wm-label-padding)"
        },
        "--wm-label-color": "var(--wm-color-warning)"
    },
    "text-info": {
        "text": {
            "color": "var(--wm-label-color)",
            "lineHeight": "var(--wm-label-line-height)",
            "letterSpacing": "var(--wm-label-letter-spacing)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "root": {
            "backgroundColor": "var(--wm-label-background-color)",
            "borderRadius": "var(--wm-label-border-radius)",
            "borderWidth": "var(--wm-label-border-width)",
            "borderStyle": "var(--wm-label-border-style)",
            "borderColor": "var(--wm-label-border-color)",
            "padding": "var(--wm-label-padding)"
        },
        "--wm-label-color": "var(--wm-color-info)"
    },
    "h1": {
        "text": {
            "fontSize": "var(--wm-label-font-size)",
            "color": "var(--wm-label-color)",
            "fontWeight": "var(--wm-label-font-weight)",
            "fontFamily": "var(--wm-label-font-family)",
            "lineHeight": "var(--wm-label-line-height)",
            "letterSpacing": "var(--wm-label-letter-spacing)",
            "margin": "var(--wm-space-0)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "--wm-label-font-size": "var(--wm-h1-font-size)",
        "--wm-label-font-weight": "var(--wm-h1-font-weight)",
        "--wm-label-font-family": "var(--wm-h1-font-family)",
        "--wm-label-line-height": "var(--wm-h1-line-height)",
        "--wm-label-letter-spacing": "var(--wm-h1-letter-spacing)"
    },
    "h2": {
        "text": {
            "fontSize": "var(--wm-label-font-size)",
            "color": "var(--wm-label-color)",
            "fontWeight": "var(--wm-label-font-weight)",
            "fontFamily": "var(--wm-label-font-family)",
            "lineHeight": "var(--wm-label-line-height)",
            "letterSpacing": "var(--wm-label-letter-spacing)",
            "margin": "var(--wm-space-0)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "--wm-label-font-size": "var(--wm-h2-font-size)",
        "--wm-label-font-weight": "var(--wm-h2-font-weight)",
        "--wm-label-font-family": "var(--wm-h2-font-family)",
        "--wm-label-line-height": "var(--wm-h2-line-height)",
        "--wm-label-letter-spacing": "var(--wm-h2-letter-spacing)"
    },
    "h3": {
        "text": {
            "fontSize": "var(--wm-label-font-size)",
            "color": "var(--wm-label-color)",
            "fontWeight": "var(--wm-label-font-weight)",
            "fontFamily": "var(--wm-label-font-family)",
            "lineHeight": "var(--wm-label-line-height)",
            "letterSpacing": "var(--wm-label-letter-spacing)",
            "margin": "var(--wm-space-0)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "--wm-label-font-size": "var(--wm-h3-font-size)",
        "--wm-label-font-weight": "var(--wm-h3-font-weight)",
        "--wm-label-font-family": "var(--wm-h3-font-family)",
        "--wm-label-line-height": "var(--wm-h3-line-height)",
        "--wm-label-letter-spacing": "var(--wm-h3-letter-spacing)"
    },
    "h4": {
        "text": {
            "fontSize": "var(--wm-label-font-size)",
            "color": "var(--wm-label-color)",
            "fontWeight": "var(--wm-label-font-weight)",
            "fontFamily": "var(--wm-label-font-family)",
            "lineHeight": "var(--wm-label-line-height)",
            "letterSpacing": "var(--wm-label-letter-spacing)",
            "margin": "var(--wm-space-0)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "--wm-label-font-size": "var(--wm-h4-font-size)",
        "--wm-label-font-weight": "var(--wm-h4-font-weight)",
        "--wm-label-font-family": "var(--wm-h4-font-family)",
        "--wm-label-line-height": "var(--wm-h4-line-height)",
        "--wm-label-letter-spacing": "var(--wm-h4-letter-spacing)"
    },
    "h5": {
        "text": {
            "fontSize": "var(--wm-label-font-size)",
            "color": "var(--wm-label-color)",
            "fontWeight": "var(--wm-label-font-weight)",
            "fontFamily": "var(--wm-label-font-family)",
            "lineHeight": "var(--wm-label-line-height)",
            "letterSpacing": "var(--wm-label-letter-spacing)",
            "margin": "var(--wm-space-0)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "--wm-label-font-size": "var(--wm-h5-font-size)",
        "--wm-label-font-weight": "var(--wm-h5-font-weight)",
        "--wm-label-font-family": "var(--wm-h5-font-family)",
        "--wm-label-line-height": "var(--wm-h5-line-height)",
        "--wm-label-letter-spacing": "var(--wm-h5-letter-spacing)"
    },
    "h6": {
        "text": {
            "fontSize": "var(--wm-label-font-size)",
            "color": "var(--wm-label-color)",
            "fontWeight": "var(--wm-label-font-weight)",
            "fontFamily": "var(--wm-label-font-family)",
            "lineHeight": "var(--wm-label-line-height)",
            "letterSpacing": "var(--wm-label-letter-spacing)",
            "margin": "var(--wm-space-0)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "--wm-label-font-size": "var(--wm-h6-font-size)",
        "--wm-label-font-weight": "var(--wm-h6-font-weight)",
        "--wm-label-font-family": "var(--wm-h6-font-family)",
        "--wm-label-line-height": "var(--wm-h6-line-height)",
        "--wm-label-letter-spacing": "var(--wm-h6-letter-spacing)"
    },
    "text-muted": {
        "text": {
            "color": "var(--wm-label-color)",
            "lineHeight": "var(--wm-label-line-height)",
            "letterSpacing": "var(--wm-label-letter-spacing)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "root": {
            "backgroundColor": "var(--wm-label-background-color)",
            "borderRadius": "var(--wm-label-border-radius)",
            "borderWidth": "var(--wm-label-border-width)",
            "borderStyle": "var(--wm-label-border-style)",
            "borderColor": "var(--wm-label-border-color)",
            "padding": "var(--wm-label-padding)"
        },
        "--wm-label-color": "var(--wm-color-on-surface-variant)"
    },
    "p": {
        "text": {
            "fontSize": "var(--wm-label-font-size)",
            "lineHeight": "var(--wm-label-line-height)",
            "letterSpacing": "var(--wm-label-letter-spacing)",
            "color": "var(--wm-label-color)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "--wm-label-font-size": "var(--wm-p-font-size)",
        "--wm-label-font-weight": "var(--wm-p-font-weight)",
        "--wm-label-font-family": "var(--wm-p-font-family)",
        "--wm-label-line-height": "var(--wm-p-line-height)",
        "--wm-label-letter-spacing": "var(--wm-p-letter-spacing)"
    },
    "media-heading": {
        "text": {
            "fontSize": "var(--wm-label-font-size)",
            "color": "var(--wm-label-color)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "--wm-label-font-size": "var(--wm-body-large-font-size)"
    },
    "text-secondary": {
        "root": {
            "backgroundColor": "var(--wm-label-background-color)",
            "borderRadius": "var(--wm-label-border-radius)",
            "borderWidth": "var(--wm-label-border-width)",
            "borderStyle": "var(--wm-label-border-style)",
            "borderColor": "var(--wm-label-border-color)",
            "padding": "var(--wm-label-padding)"
        },
        "text": {
            "color": "var(--wm-label-color)",
            "lineHeight": "var(--wm-label-line-height)",
            "letterSpacing": "var(--wm-label-letter-spacing)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "--wm-label-color": "var(--wm-color-secondary)"
    },
    "label-secondary": {
        "root": {
            "backgroundColor": "var(--wm-label-background-color)",
            "padding": "var(--wm-label-padding)",
            "borderRadius": "var(--wm-label-border-radius)"
        },
        "text": {
            "color": "var(--wm-label-color)",
            "fontWeight": "var(--wm-label-font-weight)",
            "lineHeight": "var(--wm-label-line-height)",
            "letterSpacing": "var(--wm-label-letter-spacing)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "--wm-label-border-radius": 6,
        "--wm-label-padding": "var(--wm-space-4) var(--wm-space-8)",
        "--wm-label-font-weight": "var(--wm-font-weight-700)",
        "--wm-label-background-color": "var(--wm-color-secondary)",
        "--wm-label-color": "var(--wm-color-on-secondary)"
    },
    "label-muted": {
        "root": {
            "backgroundColor": "var(--wm-label-background-color)",
            "padding": "var(--wm-label-padding)",
            "borderRadius": "var(--wm-label-border-radius)"
        },
        "text": {
            "color": "var(--wm-label-color)",
            "fontWeight": "var(--wm-label-font-weight)",
            "lineHeight": "var(--wm-label-line-height)",
            "letterSpacing": "var(--wm-label-letter-spacing)",
            "textDecoration": "var(--wm-label-text-decoration)"
        },
        "--wm-label-border-radius": 6,
        "--wm-label-padding": "var(--wm-space-4) var(--wm-space-8)",
        "--wm-label-font-weight": "var(--wm-font-weight-700)",
        "--wm-label-background-color": "var(--wm-color-on-surface-variant)",
        "--wm-label-color": "var(--wm-color-surface-variant)"
    },
    "text-tertiary": {
        "--wm-label-color": "var(--wm-color-tertiary)"
    },
    "label-tertiary": {
        "--wm-label-border-radius": 6,
        "--wm-label-padding": "var(--wm-space-4) var(--wm-space-8)",
        "--wm-label-font-weight": "var(--wm-font-weight-700)",
        "--wm-label-background-color": "var(--wm-color-tertiary)",
        "--wm-label-color": "var(--wm-color-on-tertiary)"
    },
    "success-dark-message": {
        "root": {
            "backgroundColor": "#28a745",
            "borderColor": "transparent"
        },
        "text": {
            "color": "#fff"
        },
        "icon": {
            "text": {
                "color": "#fff"
            }
        },
        "closeBtn": {
            "root": {
                "icon": {
                    "text": {
                        "color": "#fff"
                    }
                }
            }
        }
    },
    "error-dark-message": {
        "root": {
            "backgroundColor": "#dc3545",
            "borderColor": "transparent"
        },
        "text": {
            "color": "#fff"
        },
        "icon": {
            "text": {
                "color": "#fff"
            }
        },
        "closeBtn": {
            "root": {
                "icon": {
                    "text": {
                        "color": "#fff"
                    }
                }
            }
        }
    },
    "warning-dark-message": {
        "root": {
            "backgroundColor": "#ffc107",
            "borderColor": "transparent"
        },
        "text": {
            "color": "#fff"
        },
        "icon": {
            "text": {
                "color": "#fff"
            }
        },
        "closeBtn": {
            "root": {
                "icon": {
                    "text": {
                        "color": "#fff"
                    }
                }
            }
        }
    },
    "info-dark-message": {
        "root": {
            "backgroundColor": "#17a2b8",
            "borderColor": "transparent"
        },
        "text": {
            "color": "#fff"
        },
        "icon": {
            "text": {
                "color": "#fff"
            }
        },
        "closeBtn": {
            "root": {
                "icon": {
                    "text": {
                        "color": "#fff"
                    }
                }
            }
        }
    },
    "loading-dark-message": {
        "root": {
            "backgroundColor": "#17a2b8",
            "borderColor": "transparent"
        },
        "text": {
            "color": "#fff"
        },
        "icon": {
            "text": {
                "color": "#fff"
            }
        },
        "closeBtn": {
            "root": {
                "icon": {
                    "text": {
                        "color": "#fff"
                    }
                }
            }
        }
    },
    "success-light-message": {
        "root": {
            "backgroundColor": "#fff",
            "borderColor": "#ddd"
        },
        "text": {
            "color": "#666"
        },
        "icon": {
            "text": {
                "color": "#28a745"
            }
        },
        "closeBtn": {
            "root": {
                "icon": {
                    "text": {
                        "color": "#666"
                    }
                }
            }
        }
    },
    "error-light-message": {
        "root": {
            "backgroundColor": "#fff",
            "borderColor": "#ddd"
        },
        "text": {
            "color": "#666"
        },
        "icon": {
            "text": {
                "color": "#dc3545"
            }
        },
        "closeBtn": {
            "root": {
                "icon": {
                    "text": {
                        "color": "#666"
                    }
                }
            }
        }
    },
    "warning-light-message": {
        "root": {
            "backgroundColor": "#fff",
            "borderColor": "#ddd"
        },
        "text": {
            "color": "#666"
        },
        "icon": {
            "text": {
                "color": "#ffc107"
            }
        },
        "closeBtn": {
            "root": {
                "icon": {
                    "text": {
                        "color": "#666"
                    }
                }
            }
        }
    },
    "info-light-message": {
        "root": {
            "backgroundColor": "#fff",
            "borderColor": "#ddd"
        },
        "text": {
            "color": "#666"
        },
        "icon": {
            "text": {
                "color": "#17a2b8"
            }
        },
        "closeBtn": {
            "root": {
                "icon": {
                    "text": {
                        "color": "#666"
                    }
                }
            }
        }
    },
    "loading-light-message": {
        "root": {
            "backgroundColor": "#fff",
            "borderColor": "#ddd"
        },
        "text": {
            "color": "#666"
        },
        "icon": {
            "text": {
                "color": "#17a2b8"
            }
        },
        "closeBtn": {
            "root": {
                "icon": {
                    "text": {
                        "color": "#666"
                    }
                }
            }
        }
    },
    "alert-success": {
        "--wm-message-container-background": "var(--wm-color-success)",
        "--wm-message-container-border-color": "var(--wm-color-success)",
        "--wm-message-color": "var(--wm-color-on-success)",
        "closeBtn": {
            "root": {
                "backgroundColor": "var(--wm-message-close-btn-background-color)",
                "borderColor": "var(--wm-message-close-btn-border-color)"
            }
        }
    },
    "alert-info": {
        "--wm-message-container-background": "var(--wm-color-info)",
        "--wm-message-container-border-color": "var(--wm-color-info)",
        "--wm-message-color": "var(--wm-color-on-info)",
        "closeBtn": {
            "root": {
                "backgroundColor": "var(--wm-message-close-btn-background-color)",
                "borderColor": "var(--wm-message-close-btn-border-color)"
            }
        }
    },
    "alert-warning": {
        "--wm-message-container-background": "var(--wm-color-warning)",
        "--wm-message-container-border-color": "var(--wm-color-warning)",
        "--wm-message-color": "var(--wm-color-on-warning)",
        "closeBtn": {
            "root": {
                "backgroundColor": "var(--wm-message-close-btn-background-color)",
                "borderColor": "var(--wm-message-close-btn-border-color)"
            }
        }
    },
    "alert-error": {
        "--wm-message-container-background": "var(--wm-color-error)",
        "--wm-message-container-border-color": "var(--wm-color-error)",
        "--wm-message-color": "var(--wm-color-on-error)",
        "closeBtn": {
            "root": {
                "backgroundColor": "var(--wm-message-close-btn-background-color)",
                "borderColor": "var(--wm-message-close-btn-border-color)"
            }
        }
    },
    "alert-loading": {
        "--wm-message-container-background": "var(--wm-color-primary)",
        "--wm-message-container-border-color": "var(--wm-color-primary)",
        "--wm-message-color": "var(--wm-color-on-primary)",
        "closeBtn": {
            "root": {
                "backgroundColor": "var(--wm-message-close-btn-background-color)",
                "borderColor": "var(--wm-message-close-btn-border-color)"
            }
        }
    },
    "app-message": {
        "root": {
            "borderStyle": "var(--wm-message-container-border-style)",
            "borderRadius": "var(--wm-message-container-border-radius)",
            "backgroundColor": "var(--wm-message-container-background)",
            "borderColor": "var(--wm-message-container-border-color)",
            "borderWidth": "var(--wm-message-container-border-width)",
            "padding": "var(--wm-message-container-padding)"
        },
        "text": {
            "fontSize": "var(--wm-message-text-size)",
            "color": "var(--wm-message-text-color)"
        },
        "title": {
            "color": "var(--wm-message-title-color)",
            "padding": "var(--wm-message-title-padding)",
            "fontSize": "var(--wm-message-title-font-size)",
            "fontWeight": "var(--wm-message-title-font-weight)"
        },
        "message": {
            "padding": "var(--wm-message-text-wrapper-padding)"
        },
        "icon": {
            "root": {
                "width": "auto",
                "minWidth": "auto",
                "height": "auto"
            },
            "icon": {
                "fontSize": "var(--wm-message-icon-size)",
                "color": "var(--wm-message-color)"
            }
        },
        "closeBtn": {
            "icon": {
                "root": {
                    "width": "auto",
                    "minWidth": "auto",
                    "height": "auto"
                },
                "icon": {
                    "color": "var(--wm-message-color)",
                    "fontSize": "var(--wm-message-close-btn-icon-size)"
                }
            },
            "root": {
                "padding": "var(--wm-message-close-btn-padding)",
                "borderRadius": "var(--wm-message-close-btn-border-radius)",
                "borderColor": "var(--wm-message-close-btn-border-color)",
                "backgroundColor": "var(--wm-message-close-btn-background-color)",
                "rippleColor": "var(--wm-message-close-btn-ripple-color)"
            }
        }
    },
    "thumbnail-image": {
        "root": {
            "backgroundColor": "var(--wm-picture-background)",
            "borderColor": "var(--wm-picture-border-color)",
            "borderRadius": "var(--wm-picture-radius)",
            "padding": "var(--wm-picture-padding)",
            "borderWidth": "var(--wm-picture-border-width)",
            "borderStyle": "var(--wm-picture-border-style)",
            "--wm-picture-radius": "var(--wm-radius-xs)",
            "--wm-picture-padding": "var(--wm-space-1)",
            "--wm-picture-border-color": "var(--wm-color-border)",
            "--wm-picture-border-style": "var(--wm-border-style-base)",
            "--wm-picture-border-width": "var(--wm-border-width-base)",
            "--wm-picture-background": "var(--wm-color-surface-container-low)"
        }
    },
    "app-picture": {
        "root": {
            "justifyContent": "center",
            "alignItems": "center",
            "maxWidth": "100%",
            "maxHeight": "100%",
            "borderRadius": "var(--wm-picture-radius)",
            "padding": "var(--wm-picture-padding)",
            "backgroundColor": "var(--wm-picture-background)",
            "borderWidth": "var(--wm-picture-border-width)",
            "borderStyle": "var(--wm-picture-border-style)",
            "borderColor": "var(--wm-picture-border-color)"
        }
    },
    "rounded-image": {
        "root": {
            "borderRadius": "var(--wm-picture-radius)",
            "padding": "var(--wm-picture-padding)",
            "backgroundColor": "var(--wm-picture-background)",
            "borderWidth": "var(--wm-picture-border-width)",
            "borderStyle": "var(--wm-picture-border-style)",
            "borderColor": "var(--wm-picture-border-color)",
            "--wm-picture-radius": "var(--wm-radius-xs)",
            "--wm-picture-padding": "var(--wm-space-0)",
            "--wm-picture-border-color": "var(--wm-color-border)",
            "--wm-picture-border-style": "var(--wm-border-style-base)",
            "--wm-picture-border-width": "var(--wm-border-width-0)",
            "--wm-picture-background": "var(--wm-color-transparent)"
        }
    },
    "circle-image": {
        "root": {
            "borderRadius": "var(--wm-picture-radius)",
            "padding": "var(--wm-picture-padding)",
            "backgroundColor": "var(--wm-picture-background)",
            "borderWidth": "var(--wm-picture-border-width)",
            "borderStyle": "var(--wm-picture-border-style)",
            "borderColor": "var(--wm-picture-border-color)",
            "--wm-picture-radius": "var(--wm-radius-circle)",
            "--wm-picture-padding": "var(--wm-space-0)",
            "--wm-picture-border-color": "var(--wm-color-border)",
            "--wm-picture-border-style": "var(--wm-border-style-base)",
            "--wm-picture-border-width": "var(--wm-border-width-0)",
            "--wm-picture-background": "var(--wm-color-transparent)"
        }
    },
    "app-default-progress-bar": {
        "progressBar": {
            "backgroundColor": "rgba(66,99,235,.2)"
        },
        "progressValue": {
            "color": "#4263eb"
        }
    },
    "app-success-progress-bar": {
        "progressBar": {
            "backgroundColor": "rgba(40,167,69,.2)"
        },
        "progressValue": {
            "color": "#28a745"
        }
    },
    "app-info-progress-bar": {
        "progressBar": {
            "backgroundColor": "rgba(23,162,184,.2)"
        },
        "progressValue": {
            "color": "#17a2b8"
        }
    },
    "app-danger-progress-bar": {
        "progressBar": {
            "backgroundColor": "rgba(220,53,69,.2)"
        },
        "progressValue": {
            "color": "#dc3545"
        }
    },
    "app-warning-progress-bar": {
        "progressBar": {
            "backgroundColor": "rgba(255,193,7,.2)"
        },
        "progressValue": {
            "color": "#ffc107"
        }
    },
    "progress-bar-default": {
        "--wm-progress-bar-background-active": "var(--wm-color-primary)",
        "--wm-progress-bar-background-inactive": "var(--wm-color-primary-container)"
    },
    "progress-bar-success": {
        "--wm-progress-bar-background-active": "var(--wm-color-success)",
        "--wm-progress-bar-background-inactive": "var(--wm-color-success-container)",
        "progressBar": {
            "backgroundColor": "var(--wm-progress-bar-background-inactive)"
        },
        "progressValue": {
            "color": "var(--wm-progress-bar-background-active)",
            "backgroundColor": "var(--wm-progress-bar-background-active)"
        }
    },
    "progress-bar-info": {
        "--wm-progress-bar-background-active": "var(--wm-color-info)",
        "--wm-progress-bar-background-inactive": "var(--wm-color-info-container)",
        "progressBar": {
            "backgroundColor": "var(--wm-progress-bar-background-inactive)"
        },
        "progressValue": {
            "color": "var(--wm-progress-bar-background-active)",
            "backgroundColor": "var(--wm-progress-bar-background-active)"
        }
    },
    "progress-bar-warning": {
        "--wm-progress-bar-background-active": "var(--wm-color-warning)",
        "--wm-progress-bar-background-inactive": "var(--wm-color-warning-container)",
        "progressBar": {
            "backgroundColor": "var(--wm-progress-bar-background-inactive)"
        },
        "progressValue": {
            "color": "var(--wm-progress-bar-background-active)",
            "backgroundColor": "var(--wm-progress-bar-background-active)"
        }
    },
    "progress-bar-danger": {
        "--wm-progress-bar-background-active": "var(--wm-color-error)",
        "--wm-progress-bar-background-inactive": "var(--wm-color-error-container)",
        "progressBar": {
            "backgroundColor": "var(--wm-progress-bar-background-inactive)"
        },
        "progressValue": {
            "color": "var(--wm-progress-bar-background-active)",
            "backgroundColor": "var(--wm-progress-bar-background-active)"
        }
    },
    "app-progress-bar": {
        "progressBar": {
            "backgroundColor": "var(--wm-progress-bar-background-inactive)",
            "borderTopLeftRadius": "var(--wm-progress-bar-radius)",
            "borderBottomLeftRadius": "var(--wm-progress-bar-radius)",
            "borderTopRightRadius": "var(--wm-progress-bar-radius)",
            "borderBottomRightRadius": "var(--wm-progress-bar-radius)",
            "height": "var(--wm-progress-bar-height)"
        },
        "progressValue": {
            "color": "var(--wm-progress-bar-background-active)",
            "backgroundColor": "var(--wm-progress-bar-background-active)"
        },
        "tooltip": {
            "backgroundColor": "var(--wm-progress-bar-tooltip-background)",
            "paddingLeft": "var(--wm-progress-bar-tooltip-padding-horizontal)",
            "paddingRight": "var(--wm-progress-bar-tooltip-padding-horizontal)",
            "paddingTop": "var(--wm-progress-bar-tooltip-padding-vertical)",
            "paddingBottom": "var(--wm-progress-bar-tooltip-padding-vertical)",
            "borderRadius": "var(--wm-progress-bar-tooltip-border-radius)"
        },
        "tooltipLabel": {
            "color": "var(--wm-progress-bar-tooltip-label-color)",
            "fontSize": "var(--wm-progress-bar-tooltip-label-size)"
        },
        "tooltipTriangle": {
            "borderBottomColor": "var(--wm-progress-bar-tooltip-triangle-border-bottom-color)"
        }
    },
    "app-progress-circle": {
        "progressCircle": {
            "backgroundColor": "var(--wm-progress-circle-stroke-inactive)",
            "stroke": "var(--wm-progress-circle-stroke-inactive)",
            "strokeWidth": 16
        },
        "progressValue": {
            "color": "#4263eb",
            "stroke": "var(--wm-progress-circle-stroke-active)",
            "width": "var(--wm-progress-circle-progress-value-width)",
            "height": "var(--wm-progress-circle-progress-value-height)",
            "strokeWidth": "var(--wm-progress-circle-progress-value-height)",
            "backgroundColor": "var(--wm-progress-circle-stroke-active)"
        },
        "subTitle": {
            "color": "var(--wm-progress-circle-sub-title-color)",
            "fontSize": "var(--wm-progress-circle-sub-title-font-size)",
            "fontFamily": "var(--wm-progress-circle-sub-title-font-family)",
            "fill": "var(--wm-progress-circle-sub-title-color)"
        }
    },
    "app-default-progress-circle": {
        "progressCircle": {
            "backgroundColor": "rgba(66,99,235,.6)",
            "stroke": "rgba(66,99,235,0.6)"
        },
        "progressValue": {
            "color": "#4263eb",
            "stroke": "#4263eb"
        }
    },
    "app-success-progress-circle": {
        "progressCircle": {
            "backgroundColor": "rgba(40,167,69,.6)",
            "stroke": "rgba(40,167,69,0.6)"
        },
        "progressValue": {
            "color": "#28a745",
            "stroke": "#28a745"
        }
    },
    "app-info-progress-circle": {
        "progressCircle": {
            "backgroundColor": "rgba(23,162,184,.6)",
            "stroke": "rgba(23,162,184,0.6)"
        },
        "progressValue": {
            "color": "#17a2b8",
            "stroke": "#17a2b8"
        }
    },
    "app-danger-progress-circle": {
        "progressCircle": {
            "backgroundColor": "rgba(220,53,69,.6)",
            "stroke": "rgba(220,53,69,0.6)"
        },
        "progressValue": {
            "color": "#dc3545",
            "stroke": "#dc3545"
        }
    },
    "app-warning-progress-circle": {
        "progressCircle": {
            "backgroundColor": "rgba(255,193,7,.6)",
            "stroke": "rgba(255,193,7,0.6)"
        },
        "progressValue": {
            "color": "#ffc107",
            "stroke": "#ffc107"
        }
    },
    "progress-circle-default": {
        "--wm-progress-circle-stroke-inactive": "var(--wm-color-primary-container)",
        "--wm-progress-circle-stroke-active": "var(--wm-color-primary)"
    },
    "progress-circle-success": {
        "--wm-progress-circle-stroke-inactive": "var(--wm-color-success-container)",
        "--wm-progress-circle-stroke-active": "var(--wm-color-success)"
    },
    "progress-circle-info": {
        "--wm-progress-circle-stroke-inactive": "var(--wm-color-info-container)",
        "--wm-progress-circle-stroke-active": "var(--wm-color-info)"
    },
    "progress-circle-warning": {
        "--wm-progress-circle-stroke-inactive": "var(--wm-color-warning-container)",
        "--wm-progress-circle-stroke-active": "var(--wm-color-warning)"
    },
    "progress-circle-danger": {
        "--wm-progress-circle-stroke-inactive": "var(--wm-color-error-container)",
        "--wm-progress-circle-stroke-active": "var(--wm-color-error)"
    },
    "app-search": {
        "text": {
            "borderColor": "var(--wm-search-border-color)",
            "backgroundColor": "var(--wm-search-text-background-color)",
            "borderRightWidth": 0,
            "height": "var(--wm-search-height)",
            "minHeight": "var(--wm-search-height)",
            "color": "var(--wm-search-text-color)",
            "fontSize": "var(--wm-search-text-font-size)",
            "fontFamily": "var(--wm-search-text-font-family)",
            "fontWeight": "var(--wm-search-text-font-weight)",
            "borderTopLeftRadius": "var(--wm-search-border-radius)",
            "borderBottomLeftRadius": "var(--wm-search-border-radius)",
            "padding": "var(--wm-search-text-padding)",
            "borderWidth": "var(--wm-search-border-width)"
        },
        "invalid": {
            "borderBottomColor": "var(--wm-search-invalid-color)",
            "borderColor": "var(--wm-search-invalid-color)"
        },
        "searchButton": {
            "backgroundColor": "#4263eb",
            "icon": {
                "text": {
                    "color": "#fff"
                },
                "icon": {
                    "backgroundColor": "transparent",
                    "color": "var(--wm-search-btn-icon-color)",
                    "fontSize": "var(--wm-search-btn-icon-size)"
                }
            },
            "root": {
                "borderStyle": "solid",
                "borderLeftWidth": 0,
                "height": "var(--wm-search-height)",
                "rippleColor": "var(--wm-search-btn-ripple-color)",
                "backgroundColor": "var(--wm-search-btn-background-color)",
                "borderTopRightRadius": "var(--wm-search-border-radius)",
                "borderBottomRightRadius": "var(--wm-search-border-radius)",
                "borderColor": "var(--wm-search-border-color)",
                "borderWidth": "var(--wm-search-border-width)",
                "padding": "var(--wm-search-btn-padding)",
                "width": "var(--wm-search-btn-width)"
            }
        },
        "searchItem": {
            "borderBottomColor": "var(--wm-search-item-separator-color)",
            "color": "#666",
            "borderBottomStyle": "solid",
            "padding": "var(--wm-search-item-padding)",
            "marginBottom": "var(--wm-search-item-margin-bottom)",
            "borderBottomWidth": "var(--wm-search-item-separator-width)"
        },
        "placeholderText": {
            "color": "var(--wm-search-placeholder-text-color)"
        },
        "root": {
            "borderRadius": "var(--wm-search-border-radius)"
        },
        "clearButton": {
            "root": {
                "borderColor": "transparent",
                "rippleColor": "transparent",
                "padding": "var(--wm-search-clear-btn-padding)",
                "borderRadius": "var(--wm-search-clear-btn-border-radius)",
                "backgroundColor": "var(--wm-search-clear-btn-background-color)",
                "width": "var(--wm-search-clear-btn-width)"
            },
            "icon": {
                "icon": {
                    "backgroundColor": "transparent",
                    "color": "var(--wm-search-clear-btn-icon-color)",
                    "fontSize": "var(--wm-search-clear-btn-icon-size)"
                }
            }
        },
        "dataCompleteItem": {
            "root": {
                "padding": "var(--wm-search-data-complete-padding)",
                "backgroundColor": "var(--wm-search-data-complete-background)"
            },
            "text": {
                "fontSize": "var(--wm-search-data-complete-text-font-size)",
                "fontFamily": "var(--wm-search-data-complete-text-font-family)",
                "fontWeight": "var(--wm-search-data-complete-text-font-weight)",
                "color": "var(--wm-search-data-complete-text-color)"
            }
        },
        "searchItemText": {
            "fontSize": "var(--wm-search-item-text-font-size)",
            "fontFamily": "var(--wm-search-item-text-font-family)",
            "fontWeight": "var(--wm-search-item-text-font-weight)",
            "color": "var(--wm-search-item-text-color)"
        },
        "dropDownContent": {
            "borderStyle": "solid",
            "width": "var(--wm-search-dropdown-width)",
            "borderWidth": "var(--wm-search-dropdown-border-width)",
            "backgroundColor": "var(--wm-search-dropdown-background-color)",
            "borderRadius": "var(--wm-search-dropdown-border-radius)",
            "borderColor": "var(--wm-search-dropdown-border-color)"
        },
        "searchInputWrapper": {
            "borderColor": "transparent"
        }
    },
    "app-autocomplete": {
        "text": {
            "borderRadius": "var(--wm-search-border-radius)",
            "borderTopRightRadius": "var(--wm-search-border-radius)",
            "borderBottomRightRadius": "var(--wm-search-border-radius)"
        }
    },
    "app-spinner": {
        "icon": {
            "text": {
                "color": "#4263eb"
            },
            "fontSize": "var(--wm-spinner-icon-size)",
            "color": "var(--wm-spinner-icon-color)",
            "width": "var(--wm-spinner-icon-width)",
            "root": {
                "width": "auto",
                "height": "auto"
            },
            "icon": {
                "fontSize": "var(--wm-spinner-icon-size)",
                "color": "var(--wm-spinner-icon-color)"
            }
        },
        "root": {
            "display": "flex",
            "flexDirection": "row",
            "justifyContent": "center",
            "alignItems": "center",
            "height": "auto",
            "minHeight": "auto",
            "backgroundColor": "var(--wm-spinner-background)",
            "width": "var(--wm-spinner-width)"
        },
        "text": {
            "fontSize": "var(--wm-spinner-text-font-size)",
            "padding": "var(--wm-spinner-text-padding)",
            "color": "var(--wm-spinner-text-color)"
        },
        "image": {
            "fontSize": "var(--wm-spinner-icon-size)"
        },
        "lottie": {
            "height": "var(--wm-spinner-lottie-height)",
            "width": "var(--wm-spinner-lottie-width)"
        }
    },
    "app-accordionpane": {
        "root": {
            "borderColor": "var(--wm-accordion-pane-content-border-color)",
            "backgroundColor": "var(--wm-accordion-pane-content-background-color)",
            "padding": "var(--wm-accordion-pane-content-padding)",
            "borderRadius": "var(--wm-accordion-pane-content-border-radius)",
            "borderStyle": "var(--wm-accordion-pane-content-border-style)",
            "borderWidth": "var(--wm-accordion-pane-content-border-width)"
        }
    },
    "app-accordion": {
        "root": {
            "borderColor": "var(--wm-accordion-border-color)",
            "backgroundColor": "var(--wm-accordion-background-color)",
            "width": "var(--wm-accordion-width)",
            "borderWidth": "var(--wm-accordion-border-width)",
            "borderStyle": "var(--wm-accordion-border-style)",
            "borderRadius": "var(--wm-accordion-border-radius)",
            "gap": "var(--wm-accordion-gap)"
        },
        "text": {
            "color": "var(--wm-accordion-text-color)",
            "alignSelf": "flex-start",
            "borderRadius": "var(--wm-accordion-text-border-radius)",
            "borderWidth": "var(--wm-accordion-text-border-width)",
            "borderColor": "var(--wm-accordion-text-border-color)",
            "backgroundColor": "var(--wm-accordion-text-background-color)",
            "fontSize": "var(--wm-accordion-text-font-size)"
        },
        "header": {
            "borderColor": "var(--wm-accordion-header-border-color)",
            "backgroundColor": "var(--wm-accordion-header-background-color)",
            "padding": "var(--wm-accordion-header-padding)",
            "borderWidth": "var(--wm-accordion-header-border-width)",
            "borderTopLeftRadius": "var(--wm-accordion-border-radius)",
            "borderTopRightRadius": "var(--wm-accordion-border-radius)",
            "color": "var(--wm-accordion-text-color)"
        },
        "activeHeader": {
            "borderColor": "var(--wm-accordion-header-border-color)",
            "backgroundColor": "var(--wm-accordion-header-background-color)",
            "--wm-accordion-text-background-color": "transparent",
            "--wm-accordion-text-border-radius": 0,
            "--wm-accordion-badge-background-color": "transparent",
            "--wm-accordion-header-border-color": "var(--wm-color-primary)",
            "--wm-accordion-header-background-color": "var(--wm-color-primary)",
            "--wm-accordion-text-border-width": "var(--wm-border-width-0)",
            "--wm-accordion-text-border-color": "var(--wm-color-outline)",
            "--wm-accordion-text-color": "var(--wm-color-white)",
            "--wm-accordion-title-icon-color": "var(--wm-color-white)",
            "--wm-accordion-icon-color": "var(--wm-color-white)",
            "--wm-accordion-badge-border-color": "var(--wm-color-white)",
            "--wm-accordion-badge-color": "var(--wm-color-white)",
            "padding": "var(--wm-accordion-header-padding)",
            "borderWidth": "var(--wm-accordion-header-border-width)",
            "borderTopLeftRadius": "var(--wm-accordion-border-radius)",
            "borderTopRightRadius": "var(--wm-accordion-border-radius)",
            "color": "var(--wm-accordion-text-color)"
        },
        "activeHeaderTitle": {
            "color": "var(--wm-accordion-text-color)",
            "--wm-accordion-text-background-color": "transparent",
            "--wm-accordion-text-border-radius": 0,
            "--wm-accordion-badge-background-color": "transparent",
            "--wm-accordion-header-border-color": "var(--wm-color-primary)",
            "--wm-accordion-header-background-color": "var(--wm-color-primary)",
            "--wm-accordion-text-border-width": "var(--wm-border-width-0)",
            "--wm-accordion-text-border-color": "var(--wm-color-outline)",
            "--wm-accordion-text-color": "var(--wm-color-white)",
            "--wm-accordion-title-icon-color": "var(--wm-color-white)",
            "--wm-accordion-icon-color": "var(--wm-color-white)",
            "--wm-accordion-badge-border-color": "var(--wm-color-white)",
            "--wm-accordion-badge-color": "var(--wm-color-white)",
            "alignSelf": "flex-start",
            "borderRadius": "var(--wm-accordion-text-border-radius)",
            "borderWidth": "var(--wm-accordion-text-border-width)",
            "borderColor": "var(--wm-accordion-text-border-color)",
            "backgroundColor": "var(--wm-accordion-text-background-color)",
            "fontSize": "var(--wm-accordion-text-font-size)"
        },
        "activeIcon": {
            "color": "#fff",
            "--wm-accordion-text-background-color": "transparent",
            "--wm-accordion-text-border-radius": 0,
            "--wm-accordion-badge-background-color": "transparent",
            "--wm-accordion-header-border-color": "var(--wm-color-primary)",
            "--wm-accordion-header-background-color": "var(--wm-color-primary)",
            "--wm-accordion-text-border-width": "var(--wm-border-width-0)",
            "--wm-accordion-text-border-color": "var(--wm-color-outline)",
            "--wm-accordion-text-color": "var(--wm-color-white)",
            "--wm-accordion-title-icon-color": "var(--wm-color-white)",
            "--wm-accordion-icon-color": "var(--wm-color-white)",
            "--wm-accordion-badge-border-color": "var(--wm-color-white)",
            "--wm-accordion-badge-color": "var(--wm-color-white)",
            "icon": {
                "color": "var(--wm-accordion-icon-color)",
                "fontSize": "var(--wm-accordion-icon-font-size)",
                "fontWeight": "var(--wm-accordion-icon-font-weight)"
            }
        },
        "badge": {
            "color": "var(--wm-accordion-badge-color)",
            "alignSelf": "stretch",
            "fontSize": "var(--wm-accordion-badge-font-size)",
            "marginRight": "var(--wm-accordion-badge-margin-right)",
            "width": "var(--wm-accordion-badge-width)",
            "height": "var(--wm-accordion-badge-height)",
            "borderRadius": "var(--wm-accordion-badge-border-radius)",
            "borderStyle": "var(--wm-accordion-border-style)",
            "borderWidth": "var(--wm-accordion-badge-border-width)",
            "borderColor": "var(--wm-accordion-badge-border-color)",
            "backgroundColor": "var(--wm-accordion-badge-background-color)"
        },
        "activeBadge": {
            "borderColor": "var(--wm-accordion-badge-border-color)",
            "color": "var(--wm-accordion-badge-color)",
            "--wm-accordion-text-background-color": "transparent",
            "--wm-accordion-text-border-radius": 0,
            "--wm-accordion-badge-background-color": "transparent",
            "--wm-accordion-header-border-color": "var(--wm-color-primary)",
            "--wm-accordion-header-background-color": "var(--wm-color-primary)",
            "--wm-accordion-text-border-width": "var(--wm-border-width-0)",
            "--wm-accordion-text-border-color": "var(--wm-color-outline)",
            "--wm-accordion-text-color": "var(--wm-color-white)",
            "--wm-accordion-title-icon-color": "var(--wm-color-white)",
            "--wm-accordion-icon-color": "var(--wm-color-white)",
            "--wm-accordion-badge-border-color": "var(--wm-color-white)",
            "--wm-accordion-badge-color": "var(--wm-color-white)",
            "alignSelf": "stretch",
            "fontSize": "var(--wm-accordion-badge-font-size)",
            "marginRight": "var(--wm-accordion-badge-margin-right)",
            "width": "var(--wm-accordion-badge-width)",
            "height": "var(--wm-accordion-badge-height)",
            "borderRadius": "var(--wm-accordion-badge-border-radius)",
            "borderStyle": "var(--wm-accordion-border-style)",
            "borderWidth": "var(--wm-accordion-badge-border-width)",
            "backgroundColor": "var(--wm-accordion-badge-background-color)"
        },
        "default": {
            "backgroundColor": "var(--wm-accordion-badge-background-color)"
        },
        "danger": {
            "backgroundColor": "var(--wm-color-error)"
        },
        "success": {
            "backgroundColor": "var(--wm-color-success)"
        },
        "warning": {
            "backgroundColor": "var(--wm-color-warning)"
        },
        "info": {
            "backgroundColor": "var(--wm-color-info)"
        },
        "primary": {
            "backgroundColor": "var(--wm-color-primary)"
        },
        "activeTitleIcon": {
            "--wm-accordion-text-background-color": "transparent",
            "--wm-accordion-text-border-radius": 0,
            "--wm-accordion-badge-background-color": "transparent",
            "--wm-accordion-header-border-color": "var(--wm-color-primary)",
            "--wm-accordion-header-background-color": "var(--wm-color-primary)",
            "--wm-accordion-text-border-width": "var(--wm-border-width-0)",
            "--wm-accordion-text-border-color": "var(--wm-color-outline)",
            "--wm-accordion-text-color": "var(--wm-color-white)",
            "--wm-accordion-title-icon-color": "var(--wm-color-white)",
            "--wm-accordion-icon-color": "var(--wm-color-white)",
            "--wm-accordion-badge-border-color": "var(--wm-color-white)",
            "--wm-accordion-badge-color": "var(--wm-color-white)",
            "icon": {
                "color": "var(--wm-accordion-title-icon-color)"
            }
        },
        "titleIcon": {
            "icon": {
                "color": "var(--wm-accordion-title-icon-color)",
                "fontSize": "var(--wm-accordion-title-icon-size)"
            }
        },
        "subheading": {
            "fontSize": "var(--wm-accordion-header-subtitle-font-size)",
            "marginTop": "var(--wm-accordion-header-subtitle-margin-top)",
            "color": "var(--wm-accordion-text-color)"
        },
        "icon": {
            "icon": {
                "color": "var(--wm-accordion-icon-color)",
                "fontSize": "var(--wm-accordion-icon-font-size)",
                "fontWeight": "var(--wm-accordion-icon-font-weight)"
            }
        },
        "pane": {
            "borderStyle": "var(--wm-accordion-pane-border-style)",
            "borderWidth": "var(--wm-accordion-pane-border-width)",
            "borderColor": "var(--wm-accordion-pane-border-color)",
            "borderRadius": "var(--wm-accordion-pane-border-radius)"
        },
        "titleWrapper": {
            "flexGrow": 1,
            "flexShrink": 1,
            "flexBasis": 0,
            "flexDirection": "row",
            "alignItems": "flex-start",
            "width": "var(--wm-accordion-title-wrapper-width)",
            "padding": "var(--wm-accordion-title-wrapper-padding)",
            "borderWidth": "var(--wm-accordion-title-wrapper-border-width)",
            "borderRadius": "var(--wm-accordion-title-wrapper-border-radius)",
            "borderStyle": "var(--wm-accordion-title-wrapper-border-style)",
            "backgroundColor": "var(--wm-accordion-title-wrapper-background-color)"
        }
    },
    "app-gridcolumn": {
        "root": {
            "height": "auto",
            "paddingTop": "var(--wm-grid-layout-column-padding-top)",
            "paddingLeft": "var(--wm-grid-layout-column-padding-left)",
            "paddingRight": "var(--wm-grid-layout-column-padding-right)",
            "paddingBottom": "var(--wm-grid-layout-column-padding-bottom)"
        }
    },
    "table-row": {
        "root": {
            "borderColor": "#ccc"
        }
    },
    "table-header-row": {
        "root": {
            "backgroundColor": "#fff"
        }
    },
    "table-striped-row0": {
        "root": {
            "backgroundColor": "rgba(66,99,235,.1)"
        }
    },
    "table-striped-row1": {
        "root": {
            "backgroundColor": "transparent"
        }
    },
    "app-gridrow": {
        "root": {
            "width": "100%",
            "display": "flex",
            "flexDirection": "row",
            "flexWrap": "wrap"
        }
    },
    "table": {
        "root": {
            "backgroundColor": "#fff",
            "borderColor": "#ccc"
        }
    },
    "text": {
        "color": "#333"
    },
    "app-layoutgrid": {
        "root": {
            "display": "flex",
            "flexDirection": "column",
            "width": "var(--wm-grid-layout-width)",
            "paddingTop": "var(--wm-grid-layout-column-padding-top)",
            "paddingLeft": "var(--wm-grid-layout-column-padding-left)",
            "paddingRight": "var(--wm-grid-layout-column-padding-right)",
            "paddingBottom": "var(--wm-grid-layout-column-padding-bottom)"
        }
    },
    "app-panel-content": {
        "root": {
            "borderColor": "#fff"
        }
    },
    "app-panel-footer": {
        "root": {
            "backgroundColor": "var(--wm-panel-footer-background)",
            "paddingInline": "var(--wm-panel-footer-padding-inline)",
            "paddingBlock": "var(--wm-panel-footer-padding-block)",
            "borderStyle": "var(--wm-panel-footer-border-style)",
            "borderWidth": "var(--wm-panel-footer-border-width)",
            "borderColor": "var(--wm-panel-footer-border-color)",
            "borderRadius": "var(--wm-panel-footer-border-radius)",
            "minHeight": "var(--wm-panel-footer-min-height)",
            "marginTop": "var(--wm-panel-footer-margin-top)",
            "marginBottom": "var(--wm-panel-footer-margin-bottom)",
            "marginLeft": "var(--wm-panel-footer-margin-left)",
            "marginRight": "var(--wm-panel-footer-margin-right)"
        }
    },
    "app-panel": {
        "root": {
            "backgroundColor": "var(--wm-panel-background)",
            "paddingTop": 0,
            "paddingRight": 0,
            "paddingBottom": 0,
            "paddingLeft": 0,
            "borderRadius": "var(--wm-panel-radius)",
            "borderColor": "var(--wm-panel-border-color)",
            "borderWidth": "var(--wm-panel-border-width)",
            "boxShadow": "var(--wm-panel-shadow)"
        },
        "text": {
            "color": "var(--wm-panel-heading-text-color)",
            "fontFamily": "var(--wm-panel-heading-font-family)",
            "fontSize": "var(--wm-panel-heading-font-size)",
            "fontWeight": "var(--wm-panel-heading-font-weight)",
            "letterSpacing": "var(--wm-panel-heading-letter-spacing)",
            "lineHeight": "var(--wm-panel-heading-line-height)"
        },
        "header": {
            "backgroundColor": "var(--wm-panel-heading-background)",
            "borderColor": "#fff",
            "gap": "var(--wm-panel-heading-gap)",
            "paddingInline": "var(--wm-panel-heading-padding-inline)",
            "paddingBlock": "var(--wm-panel-heading-padding-block)"
        },
        "badge": {
            "color": "#fff"
        },
        "default": {
            "backgroundColor": "#888",
            "color": "#fff"
        },
        "danger": {
            "backgroundColor": "#dc3545",
            "color": "#fff"
        },
        "success": {
            "backgroundColor": "#28a745",
            "color": "#fff"
        },
        "warning": {
            "backgroundColor": "#ffc107",
            "color": "#fff"
        },
        "info": {
            "backgroundColor": "#17a2b8",
            "color": "#fff"
        },
        "primary": {
            "backgroundColor": "#4263eb",
            "color": "#fff"
        },
        "icon": {
            "text": {
                "fontSize": "var(--wm-panel-heading-icon-size)",
                "color": "var(--wm-panel-heading-icon-color)"
            }
        },
        "subheading": {
            "fontFamily": "var(--wm-panel-description-font-family)",
            "fontSize": "var(--wm-panel-description-font-size)",
            "fontWeight": "var(--wm-panel-description-font-weight)",
            "letterSpacing": "var(--wm-panel-description-letter-spacing)",
            "lineHeight": "var(--wm-panel-description-line-height)",
            "color": "var(--wm-panel-description-color)"
        }
    },
    "panel-default": {
        "header": {
            "backgroundColor": "var(--wm-panel-heading-background)"
        },
        "text": {
            "color": "var(--wm-panel-heading-text-color)"
        },
        "subheading": {
            "color": "var(--wm-panel-description-color)"
        },
        "icon": {
            "text": {
                "color": "var(--wm-panel-heading-icon-color)"
            }
        },
        "--wm-panel-heading-background": "var(--wm-color-surface-container)",
        "--wm-panel-heading-icon-color": "var(--wm-color-on-surface)",
        "--wm-panel-heading-text-color": "var(--wm-color-on-surface)",
        "--wm-panel-description-color": "var(--wm-color-on-surface)"
    },
    "panel-danger": {
        "header": {
            "backgroundColor": "var(--wm-panel-heading-background)"
        },
        "text": {
            "color": "var(--wm-panel-heading-text-color)"
        },
        "subheading": {
            "color": "var(--wm-panel-description-color)"
        },
        "icon": {
            "text": {
                "color": "var(--wm-panel-heading-icon-color)"
            }
        },
        "--wm-panel-heading-background": "var(--wm-color-error-container)",
        "--wm-panel-heading-icon-color": "var(--wm-color-error)",
        "--wm-panel-heading-text-color": "var(--wm-color-error)",
        "--wm-panel-description-color": "var(--wm-color-error)"
    },
    "panel-success": {
        "header": {
            "backgroundColor": "var(--wm-panel-heading-background)"
        },
        "text": {
            "color": "var(--wm-panel-heading-text-color)"
        },
        "subheading": {
            "color": "var(--wm-panel-description-color)"
        },
        "icon": {
            "text": {
                "color": "var(--wm-panel-heading-icon-color)"
            }
        },
        "--wm-panel-heading-background": "var(--wm-color-success-container)",
        "--wm-panel-heading-icon-color": "var(--wm-color-success)",
        "--wm-panel-heading-text-color": "var(--wm-color-success)",
        "--wm-panel-description-color": "var(--wm-color-success)"
    },
    "panel-warning": {
        "header": {
            "backgroundColor": "var(--wm-panel-heading-background)"
        },
        "text": {
            "color": "var(--wm-panel-heading-text-color)"
        },
        "subheading": {
            "color": "var(--wm-panel-description-color)"
        },
        "icon": {
            "text": {
                "color": "var(--wm-panel-heading-icon-color)"
            }
        },
        "--wm-panel-heading-background": "var(--wm-color-warning-container)",
        "--wm-panel-heading-icon-color": "var(--wm-color-warning)",
        "--wm-panel-heading-text-color": "var(--wm-color-warning)",
        "--wm-panel-description-color": "var(--wm-color-warning)"
    },
    "panel-info": {
        "header": {
            "backgroundColor": "var(--wm-panel-heading-background)"
        },
        "text": {
            "color": "var(--wm-panel-heading-text-color)"
        },
        "subheading": {
            "color": "var(--wm-panel-description-color)"
        },
        "icon": {
            "text": {
                "color": "var(--wm-panel-heading-icon-color)"
            }
        },
        "--wm-panel-heading-background": "var(--wm-color-info-container)",
        "--wm-panel-heading-icon-color": "var(--wm-color-info)",
        "--wm-panel-heading-text-color": "var(--wm-color-info)",
        "--wm-panel-description-color": "var(--wm-color-info)"
    },
    "panel-primary": {
        "header": {
            "backgroundColor": "var(--wm-panel-heading-background)"
        },
        "text": {
            "color": "var(--wm-panel-heading-text-color)"
        },
        "subheading": {
            "color": "var(--wm-panel-description-color)"
        },
        "icon": {
            "text": {
                "color": "var(--wm-panel-heading-icon-color)"
            }
        },
        "--wm-panel-heading-background": "var(--wm-color-primary-container)",
        "--wm-panel-heading-icon-color": "var(--wm-color-primary)",
        "--wm-panel-heading-text-color": "var(--wm-color-primary)",
        "--wm-panel-description-color": "var(--wm-color-primary)"
    },
    "panel-secondary": {
        "root": {
            "--wm-panel-heading-background": "var(--wm-color-secondary-container)",
            "--wm-panel-heading-icon-color": "var(--wm-color-secondary)",
            "--wm-panel-heading-text-color": "var(--wm-color-secondary)",
            "--wm-panel-description-color": "var(--wm-color-secondary)"
        },
        "header": {
            "backgroundColor": "var(--wm-panel-heading-background)"
        },
        "text": {
            "color": "var(--wm-panel-heading-text-color)"
        },
        "subheading": {
            "color": "var(--wm-panel-description-color)"
        },
        "icon": {
            "text": {
                "color": "var(--wm-panel-heading-icon-color)"
            }
        }
    },
    "panel-tertiary": {
        "--wm-panel-heading-background": "var(--wm-color-tertiary-container)",
        "--wm-panel-heading-icon-color": "var(--wm-color-tertiary)",
        "--wm-panel-heading-text-color": "var(--wm-color-tertiary)",
        "--wm-panel-description-color": "var(--wm-color-tertiary)",
        "header": {
            "backgroundColor": "var(--wm-panel-heading-background)"
        },
        "text": {
            "color": "var(--wm-panel-heading-text-color)"
        },
        "subheading": {
            "color": "var(--wm-panel-description-color)"
        },
        "icon": {
            "text": {
                "color": "var(--wm-panel-heading-icon-color)"
            }
        }
    },
    "app-tabpane": {
        "root": {
            "backgroundColor": "var(--wm-tabs-background)"
        }
    },
    "app-tabs": {
        "root": {
            "borderColor": "var(--wm-tabs-border-color)",
            "width": "100%",
            "backgroundColor": "var(--wm-tabs-background)",
            "borderRadius": "var(--wm-tabs-border-radius)",
            "borderStyle": "var(--wm-tabs-border-style)",
            "borderWidth": "var(--wm-tabs-border-width)",
            "borderBottomWidth": "var(--wm-tabs-border-width)",
            "minHeight": "var(--wm-tabs-min-height)"
        }
    },
    "app-tabheader": {
        "activeIndicator": {
            "--wm-tabs-item-heading-indicator-height": 3,
            "--wm-tabs-item-heading-padding": "var(--wm-space-2)",
            "--wm-tabs-item-heading-border-radius": "var(--wm-radius-none)",
            "--wm-tabs-item-heading-border-style": "var(--wm-border-style-base)",
            "--wm-tabs-item-heading-border-color": "var(--wm-color-surface)",
            "--wm-tabs-item-heading-border-width": "var(--wm-border-width-0)",
            "--wm-tabs-item-heading-font-size": "var(--wm-h6-font-size)",
            "--wm-tabs-item-heading-font-weight": "var(--wm-h6-font-weight)",
            "--wm-tabs-item-heading-font-family": "var(--wm-h6-font-family)",
            "--wm-tabs-item-heading-line-height": "var(--wm-h6-line-height)",
            "--wm-tabs-item-heading-indicator-margin": "var(--wm-space-0)",
            "--wm-tabs-item-heading-indicator-background": "var(--wm-color-primary)",
            "--wm-tabs-item-heading-background": "var(--wm-color-surface)",
            "--wm-tabs-item-heading-text-color": "var(--wm-color-primary)",
            "--wm-tabs-item-heading-icon-size": "var(--wm-icon-size)",
            "--wm-tabs-item-heading-icon-color": "var(--wm-color-primary)",
            "backgroundColor": "var(--wm-tabs-item-heading-indicator-background)",
            "margin": "var(--wm-tabs-item-heading-indicator-margin)",
            "height": "var(--wm-tabs-item-heading-indicator-height)"
        },
        "activeHeader": {
            "--wm-tabs-item-heading-indicator-height": 3,
            "--wm-tabs-item-heading-padding": "var(--wm-space-2)",
            "--wm-tabs-item-heading-border-radius": "var(--wm-radius-none)",
            "--wm-tabs-item-heading-border-style": "var(--wm-border-style-base)",
            "--wm-tabs-item-heading-border-color": "var(--wm-color-surface)",
            "--wm-tabs-item-heading-border-width": "var(--wm-border-width-0)",
            "--wm-tabs-item-heading-font-size": "var(--wm-h6-font-size)",
            "--wm-tabs-item-heading-font-weight": "var(--wm-h6-font-weight)",
            "--wm-tabs-item-heading-font-family": "var(--wm-h6-font-family)",
            "--wm-tabs-item-heading-line-height": "var(--wm-h6-line-height)",
            "--wm-tabs-item-heading-indicator-margin": "var(--wm-space-0)",
            "--wm-tabs-item-heading-indicator-background": "var(--wm-color-primary)",
            "--wm-tabs-item-heading-background": "var(--wm-color-surface)",
            "--wm-tabs-item-heading-text-color": "var(--wm-color-primary)",
            "--wm-tabs-item-heading-icon-size": "var(--wm-icon-size)",
            "--wm-tabs-item-heading-icon-color": "var(--wm-color-primary)",
            "backgroundColor": "var(--wm-tabs-item-heading-background)",
            "padding": "var(--wm-tabs-item-heading-padding)",
            "borderWidth": "var(--wm-tabs-item-heading-border-width)",
            "borderStyle": "var(--wm-tabs-item-heading-border-style)",
            "borderColor": "var(--wm-tabs-item-heading-border-color)",
            "borderRadius": "var(--wm-tabs-item-heading-border-radius)"
        },
        "activeHeaderIcon": {
            "--wm-tabs-item-heading-indicator-height": 3,
            "--wm-tabs-item-heading-padding": "var(--wm-space-2)",
            "--wm-tabs-item-heading-border-radius": "var(--wm-radius-none)",
            "--wm-tabs-item-heading-border-style": "var(--wm-border-style-base)",
            "--wm-tabs-item-heading-border-color": "var(--wm-color-surface)",
            "--wm-tabs-item-heading-border-width": "var(--wm-border-width-0)",
            "--wm-tabs-item-heading-font-size": "var(--wm-h6-font-size)",
            "--wm-tabs-item-heading-font-weight": "var(--wm-h6-font-weight)",
            "--wm-tabs-item-heading-font-family": "var(--wm-h6-font-family)",
            "--wm-tabs-item-heading-line-height": "var(--wm-h6-line-height)",
            "--wm-tabs-item-heading-indicator-margin": "var(--wm-space-0)",
            "--wm-tabs-item-heading-indicator-background": "var(--wm-color-primary)",
            "--wm-tabs-item-heading-background": "var(--wm-color-surface)",
            "--wm-tabs-item-heading-text-color": "var(--wm-color-primary)",
            "--wm-tabs-item-heading-icon-size": "var(--wm-icon-size)",
            "--wm-tabs-item-heading-icon-color": "var(--wm-color-primary)",
            "icon": {
                "color": "var(--wm-tabs-item-heading-icon-color)",
                "fontSize": "var(--wm-tabs-item-heading-icon-size)",
                "height": "var(--wm-tabs-item-heading-icon-height)",
                "width": "var(--wm-tabs-item-heading-icon-width)"
            }
        },
        "activeHeaderText": {
            "--wm-tabs-item-heading-indicator-height": 3,
            "--wm-tabs-item-heading-padding": "var(--wm-space-2)",
            "--wm-tabs-item-heading-border-radius": "var(--wm-radius-none)",
            "--wm-tabs-item-heading-border-style": "var(--wm-border-style-base)",
            "--wm-tabs-item-heading-border-color": "var(--wm-color-surface)",
            "--wm-tabs-item-heading-border-width": "var(--wm-border-width-0)",
            "--wm-tabs-item-heading-font-size": "var(--wm-h6-font-size)",
            "--wm-tabs-item-heading-font-weight": "var(--wm-h6-font-weight)",
            "--wm-tabs-item-heading-font-family": "var(--wm-h6-font-family)",
            "--wm-tabs-item-heading-line-height": "var(--wm-h6-line-height)",
            "--wm-tabs-item-heading-indicator-margin": "var(--wm-space-0)",
            "--wm-tabs-item-heading-indicator-background": "var(--wm-color-primary)",
            "--wm-tabs-item-heading-background": "var(--wm-color-surface)",
            "--wm-tabs-item-heading-text-color": "var(--wm-color-primary)",
            "--wm-tabs-item-heading-icon-size": "var(--wm-icon-size)",
            "--wm-tabs-item-heading-icon-color": "var(--wm-color-primary)",
            "color": "var(--wm-tabs-item-heading-text-color)",
            "fontSize": "var(--wm-tabs-item-heading-font-size)",
            "fontWeight": "var(--wm-tabs-item-heading-font-weight)",
            "fontFamily": "var(--wm-tabs-item-heading-font-family)",
            "lineHeight": "var(--wm-tabs-item-heading-line-height)"
        },
        "root": {
            "backgroundColor": "var(--wm-tabs-heading-background)",
            "borderRadius": "var(--wm-tabs-heading-border-radius)",
            "borderStyle": "var(--wm-tabs-heading-border-style)",
            "borderWidth": "var(--wm-tabs-heading-border-width)",
            "borderColor": "var(--wm-tabs-heading-border-color)"
        },
        "headerText": {
            "color": "var(--wm-tabs-item-heading-text-color)",
            "fontSize": "var(--wm-tabs-item-heading-font-size)",
            "fontWeight": "var(--wm-tabs-item-heading-font-weight)",
            "fontFamily": "var(--wm-tabs-item-heading-font-family)",
            "lineHeight": "var(--wm-tabs-item-heading-line-height)"
        },
        "arrowIndicator": {
            "backgroundColor": "#fff"
        },
        "arrowIndicatorDot": {
            "backgroundColor": "#fff"
        },
        "header": {
            "padding": "var(--wm-tabs-item-heading-padding)",
            "borderWidth": "var(--wm-tabs-item-heading-border-width)",
            "borderStyle": "var(--wm-tabs-item-heading-border-style)",
            "borderColor": "var(--wm-tabs-item-heading-border-color)",
            "borderRadius": "var(--wm-tabs-item-heading-border-radius)",
            "backgroundColor": "var(--wm-tabs-item-heading-background)"
        },
        "headerIcon": {
            "icon": {
                "color": "var(--wm-tabs-item-heading-icon-color)",
                "fontSize": "var(--wm-tabs-item-heading-icon-size)",
                "height": "var(--wm-tabs-item-heading-icon-height)",
                "width": "var(--wm-tabs-item-heading-icon-width)"
            }
        }
    },
    "bg-danger": {
        "root": {
            "backgroundColor": "var(--wm-tile-background-color)",
            "--wm-tile-background-color": "var(--wm-color-error-container)",
            "--wm-tile-color": "var(--wm-color-error)"
        }
    },
    "bg-info": {
        "root": {
            "backgroundColor": "var(--wm-tile-background-color)",
            "--wm-tile-background-color": "var(--wm-color-info-container)",
            "--wm-tile-color": "var(--wm-color-info)"
        }
    },
    "bg-primary": {
        "root": {
            "backgroundColor": "var(--wm-tile-background-color)",
            "--wm-tile-background-color": "var(--wm-color-primary-container)",
            "--wm-tile-color": "var(--wm-color-primary)"
        }
    },
    "bg-success": {
        "root": {
            "backgroundColor": "var(--wm-tile-background-color)",
            "--wm-tile-background-color": "var(--wm-color-success-container)",
            "--wm-tile-color": "var(--wm-color-success)"
        }
    },
    "bg-warning": {
        "root": {
            "backgroundColor": "var(--wm-tile-background-color)",
            "--wm-tile-background-color": "var(--wm-color-warning-container)",
            "--wm-tile-color": "var(--wm-color-warning)"
        }
    },
    "bg-default": {
        "root": {
            "backgroundColor": "var(--wm-tile-background-color)",
            "--wm-tile-background-color": "var(--wm-color-surface-container-low)",
            "--wm-tile-color": "var(--wm-color-on-surface-variant)"
        }
    },
    "bg-secondary": {
        "root": {
            "backgroundColor": "var(--wm-tile-background-color)",
            "--wm-tile-background-color": "var(--wm-color-secondary-container)",
            "--wm-tile-color": "var(--wm-color-secondary)"
        }
    },
    "bg-tertiary": {
        "root": {
            "backgroundColor": "var(--wm-tile-background-color)",
            "--wm-tile-background-color": "var(--wm-color-tertiary-container)",
            "--wm-tile-color": "var(--wm-color-tertiary)"
        }
    },
    "well": {
        "root": {
            "backgroundColor": "#fff",
            "borderColor": "#eee"
        }
    },
    "tile-template-text": {
        "text": {
            "color": "#fff",
            "root": {
                "color": "var(--wm-tile-color)"
            }
        }
    },
    "bg-default-filled": {
        "root": {
            "--wm-tile-background-color": "var(--wm-color-surface-container-highest)",
            "--wm-tile-color": "var(--wm-color-on-surface-variant)"
        }
    },
    "bg-primary-filled": {
        "root": {
            "--wm-tile-background-color": "var(--wm-color-primary)",
            "--wm-tile-color": "var(--wm-color-on-primary)"
        }
    },
    "bg-secondary-filled": {
        "root": {
            "--wm-tile-background-color": "var(--wm-color-secondary)",
            "--wm-tile-color": "var(--wm-color-on-secondary)"
        }
    },
    "bg-tertiary-filled": {
        "root": {
            "--wm-tile-background-color": "var(--wm-color-tertiary)",
            "--wm-tile-color": "var(--wm-color-on-tertiary)"
        }
    },
    "bg-success-filled": {
        "root": {
            "--wm-tile-background-color": "var(--wm-color-success)",
            "--wm-tile-color": "var(--wm-color-on-success)"
        }
    },
    "bg-info-filled": {
        "root": {
            "--wm-tile-background-color": "var(--wm-color-info)",
            "--wm-tile-color": "var(--wm-color-on-info)"
        }
    },
    "bg-warning-filled": {
        "root": {
            "--wm-tile-background-color": "var(--wm-color-warning)",
            "--wm-tile-color": "var(--wm-color-on-warning)"
        }
    },
    "bg-danger-filled": {
        "root": {
            "--wm-tile-background-color": "var(--wm-color-error)",
            "--wm-tile-color": "var(--wm-color-on-error)"
        }
    },
    "app-tile": {
        "root": {
            "borderStyle": "solid",
            "backgroundColor": "var(--wm-tile-background-color)",
            "borderRadius": "var(--wm-tile-border-radius)",
            "borderWidth": "var(--wm-tile-border-width)",
            "borderColor": "var(--wm-tile-border-color)",
            "padding": "var(--wm-tile-padding)",
            "color": "var(--wm-tile-color)"
        }
    },
    "app-wizard": {
        "root": {
            "backgroundColor": "var(--wm-wizard-background-color)",
            "borderRadius": "var(--wm-wizard-border-radius)",
            "boxShadow": "var(--wm-wizard-box-shadow)",
            "padding": "var(--wm-wizard-padding)",
            "gap": "var(--wm-wizard-gap)"
        },
        "stepTitle": {
            "color": "var(--wm-wizard-step-title-color)",
            "fontFamily": "var(--wm-wizard-step-title-font-family)",
            "fontWeight": "var(--wm-wizard-step-title-font-weight)",
            "fontSize": "var(--wm-wizard-step-title-font-size)",
            "lineHeight": "var(--wm-wizard-step-title-line-height)",
            "letterSpacing": "var(--wm-wizard-step-title-letter-spacing)"
        },
        "stepSubTitle": {
            "color": "var(--wm-wizard-step-description-color)",
            "fontFamily": "var(--wm-wizard-step-description-font-family)",
            "fontWeight": "var(--wm-wizard-step-description-font-weight)",
            "fontSize": "var(--wm-wizard-step-description-font-size)",
            "lineHeight": "var(--wm-wizard-step-description-line-height)",
            "letterSpacing": "var(--wm-wizard-step-description-letter-spacing)"
        },
        "step": {
            "backgroundColor": "var(--wm-wizard-step-indicator-background-color)",
            "color": "#999",
            "borderColor": "var(--wm-wizard-step-indicator-border-color)",
            "width": "var(--wm-wizard-step-indicator-size)",
            "height": "var(--wm-wizard-step-indicator-size)",
            "borderWidth": "var(--wm-wizard-step-indicator-border-width)",
            "borderStyle": "var(--wm-wizard-step-indicator-border-style)",
            "borderRadius": "var(--wm-wizard-step-indicator-border-radius)",
            "gap": "var(--wm-wizard-step-gap)"
        },
        "activeStep": {
            "backgroundColor": "var(--wm-wizard-step-indicator-background-color)",
            "borderColor": "var(--wm-wizard-step-indicator-border-color)",
            "color": "var(--wm-wizard-step-count-color)",
            "--wm-wizard-step-indicator-background-color": "var(--wm-color-secondary)",
            "--wm-wizard-step-indicator-border-color": "var(--wm-color-secondary)",
            "--wm-wizard-step-count-color": "var(--wm-color-on-secondary)",
            "--wm-wizard-step-icon-color": "var(--wm-color-on-secondary)",
            "--wm-wizard-step-title-color": "var(--wm-color-on-surface)",
            "--wm-wizard-step-title-font-family": "var(--wm-label-large-font-family)",
            "--wm-wizard-step-title-font-weight": "var(--wm-font-weight-600)",
            "--wm-wizard-step-title-font-size": "var(--wm-label-large-font-size)",
            "--wm-wizard-step-title-line-height": "var(--wm-label-large-line-height)",
            "--wm-wizard-step-title-letter-spacing": "var(--wm-label-large-letter-spacing)"
        },
        "doneStep": {
            "backgroundColor": "var(--wm-wizard-step-indicator-background-color)",
            "borderColor": "var(--wm-wizard-step-indicator-border-color)",
            "color": "var(--wm-wizard-step-icon-color)",
            "--wm-wizard-step-indicator-background-color": "var(--wm-color-success)",
            "--wm-wizard-step-indicator-border-color": "var(--wm-color-success)",
            "--wm-wizard-step-count-color": "var(--wm-color-on-secondary)",
            "--wm-wizard-step-icon-color": "var(--wm-color-on-secondary)",
            "--wm-wizard-step-title-color": "var(--wm-color-on-surface)",
            "--wm-wizard-step-title-font-family": "var(--wm-label-large-font-family)",
            "--wm-wizard-step-title-font-weight": "var(--wm-font-weight-600)",
            "--wm-wizard-step-title-font-size": "var(--wm-label-large-font-size)",
            "--wm-wizard-step-title-line-height": "var(--wm-label-large-line-height)",
            "--wm-wizard-step-title-letter-spacing": "var(--wm-label-large-letter-spacing)"
        },
        "wizardBody": {
            "borderColor": "#ccc",
            "height": "var(--wm-wizard-body-height)",
            "padding": "var(--wm-wizard-body-padding)"
        },
        "stepConnector": {
            "backgroundColor": "var(--wm-wizard-step-connector-color)",
            "width": "var(--wm-wizard-step-connector-width)",
            "borderStyle": "var(--wm-wizard-step-connector-style)"
        },
        "stepCounter": {
            "color": "var(--wm-wizard-step-count-color)",
            "fontFamily": "var(--wm-wizard-step-count-font-family)",
            "fontSize": "var(--wm-wizard-step-count-font-size)",
            "fontWeight": "var(--wm-wizard-step-count-font-weight)",
            "lineHeight": "var(--wm-wizard-step-count-line-height)"
        },
        "numberTextStepConnector": {
            "color": "#999"
        },
        "wizardHeader": {
            "backgroundColor": "var(--wm-wizard-heading-background-color)",
            "borderRadius": "var(--wm-wizard-heading-radius)",
            "padding": "var(--wm-wizard-heading-padding)"
        },
        "activeStepCounter": {
            "color": "var(--wm-wizard-step-count-color)",
            "--wm-wizard-step-indicator-background-color": "var(--wm-color-secondary)",
            "--wm-wizard-step-indicator-border-color": "var(--wm-color-secondary)",
            "--wm-wizard-step-count-color": "var(--wm-color-on-secondary)",
            "--wm-wizard-step-icon-color": "var(--wm-color-on-secondary)",
            "--wm-wizard-step-title-color": "var(--wm-color-on-surface)",
            "--wm-wizard-step-title-font-family": "var(--wm-label-large-font-family)",
            "--wm-wizard-step-title-font-weight": "var(--wm-font-weight-600)",
            "--wm-wizard-step-title-font-size": "var(--wm-label-large-font-size)",
            "--wm-wizard-step-title-line-height": "var(--wm-label-large-line-height)",
            "--wm-wizard-step-title-letter-spacing": "var(--wm-label-large-letter-spacing)"
        },
        "stepIcon": {
            "text": {
                "color": "var(--wm-wizard-step-icon-color)",
                "fontSize": "var(--wm-wizard-step-icon-size)"
            },
            "root": {
                "color": "var(--wm-wizard-step-icon-color)"
            },
            "icon": {
                "minWidth": 0,
                "width": "auto",
                "fontSize": "var(--wm-wizard-step-icon-size)"
            }
        }
    },
    "app-default-container": {
        "root": {
            "borderStyle": "var(--wm-container-border-style)",
            "boxShadow": "var(--wm-container-box-shadow)",
            "backgroundColor": "var(--wm-container-background-color)",
            "padding": "var(--wm-container-padding)",
            "borderRadius": "var(--wm-container-border-radius)",
            "borderWidth": "var(--wm-container-border-width)",
            "borderColor": "var(--wm-container-border-color)",
            "opacity": "var(--wm-container-opacity)"
        },
        "--wm-container-border-color": "transparent",
        "--wm-container-border-style": "var(--wm-border-style-base)",
        "--wm-container-border-width": "var(--wm-border-width-0)",
        "--wm-container-border-radius": "var(--wm-radius-none)",
        "--wm-container-box-shadow": "var(--wm-elevation-shadow-none)",
        "--wm-container-padding": "var(--wm-space-0)"
    },
    "app-elevated-container": {
        "root": {
            "borderStyle": "var(--wm-container-border-style)",
            "boxShadow": "var(--wm-container-box-shadow)",
            "backgroundColor": "var(--wm-container-background-color)",
            "padding": "var(--wm-container-padding)",
            "borderRadius": "var(--wm-container-border-radius)",
            "borderWidth": "var(--wm-container-border-width)",
            "borderColor": "var(--wm-container-border-color)",
            "opacity": "var(--wm-container-opacity)"
        },
        "--wm-container-border-color": "transparent",
        "--wm-container-box-shadow": "var(--wm-elevation-shadow-1)",
        "--wm-container-border-style": "var(--wm-border-style-base)",
        "--wm-container-border-width": "var(--wm-border-width-base)",
        "--wm-container-border-radius": "var(--wm-radius-sm)",
        "--wm-container-padding": "var(--wm-space-0)"
    },
    "app-outlined-container": {
        "root": {
            "borderStyle": "var(--wm-container-border-style)",
            "boxShadow": "var(--wm-container-box-shadow)",
            "backgroundColor": "var(--wm-container-background-color)",
            "padding": "var(--wm-container-padding)",
            "borderRadius": "var(--wm-container-border-radius)",
            "borderWidth": "var(--wm-container-border-width)",
            "borderColor": "var(--wm-container-border-color)",
            "opacity": "var(--wm-container-opacity)"
        },
        "--wm-container-border-radius": 1,
        "--wm-container-border-style": "var(--wm-border-style-base)",
        "--wm-container-border-width": "var(--wm-border-width-base)",
        "--wm-container-border-color": "var(--wm-color-outline-variant)",
        "--wm-container-box-shadow": "var(--wm-elevation-shadow-none)",
        "--wm-container-padding": "var(--wm-space-0)"
    },
    "app-container": {
        "root": {
            "borderStyle": "var(--wm-container-border-style)",
            "boxShadow": "var(--wm-container-box-shadow)",
            "backgroundColor": "var(--wm-container-background-color)",
            "padding": "var(--wm-container-padding)",
            "borderRadius": "var(--wm-container-border-radius)",
            "borderWidth": "var(--wm-container-border-width)",
            "borderColor": "var(--wm-container-border-color)",
            "opacity": "var(--wm-container-opacity)"
        }
    },
    "app-card-content": {
        "root": {
            "backgroundColor": "var(--wm-card-background)"
        }
    },
    "app-card-footer": {
        "root": {
            "backgroundColor": "var(--wm-card-background)",
            "borderColor": "var(--wm-card-border-color)",
            "borderStyle": "var(--wm-card-border-style)"
        }
    },
    "app-card": {
        "root": {
            "borderColor": "#ddd",
            "shadowColor": "#000000",
            "backgroundColor": "#fff"
        },
        "heading": {
            "backgroundColor": "var(--wm-card-header-background-color)",
            "width": "var(--wm-card-header-width)",
            "padding": "var(--wm-card-header-padding)"
        },
        "title": {
            "text": {
                "color": "#333"
            }
        },
        "subheading": {
            "root": {
                "color": "#666"
            },
            "text": {
                "color": "#666"
            }
        }
    },
    "card-default": {
        "borderWidth": "var(--wm-card-border-width)",
        "borderStyle": "var(--wm-card-border-style)",
        "borderColor": "var(--wm-card-border-color)",
        "borderRadius": "var(--wm-card-border-radius)",
        "backgroundColor": "var(--wm-card-background)",
        "boxShadow": "var(--wm-card-shadow)",
        "padding": "var(--wm-card-padding)",
        "--wm-card-background": "transparent",
        "--wm-card-shadow": "none",
        "--wm-card-border-width": "var(--wm-border-width-base)",
        "--wm-card-border-style": "var(--wm-border-style-base)",
        "--wm-card-border-color": "var(--wm-color-outline-variant)",
        "--wm-card-border-radius": "var(--wm-radius-md)"
    },
    "card-filled": {
        "borderWidth": "var(--wm-card-border-width)",
        "borderStyle": "var(--wm-card-border-style)",
        "borderColor": "var(--wm-card-border-color)",
        "borderRadius": "var(--wm-card-border-radius)",
        "backgroundColor": "var(--wm-card-background)",
        "boxShadow": "var(--wm-card-shadow)",
        "padding": "var(--wm-card-padding)",
        "--wm-card-border-width": 0,
        "--wm-card-shadow": "none",
        "--wm-card-border-style": "var(--wm-border-style-base)",
        "--wm-card-border-color": "var(--wm-color-outline-variant)",
        "--wm-card-border-radius": "var(--wm-radius-md)",
        "--wm-card-background": "var(--wm-color-surface-bright)"
    },
    "card-elevated": {
        "borderWidth": "var(--wm-card-border-width)",
        "borderStyle": "var(--wm-card-border-style)",
        "borderColor": "var(--wm-card-border-color)",
        "borderRadius": "var(--wm-card-border-radius)",
        "backgroundColor": "var(--wm-card-background)",
        "boxShadow": "var(--wm-card-shadow)",
        "padding": "var(--wm-card-padding)",
        "--wm-card-border-width": 0,
        "--wm-card-shadow": "var(--wm-elevation-shadow-1)",
        "--wm-card-background": "var(--wm-color-surface-container-lowest)"
    },
    "app-list-template": {
        "root": {
            "root": {
                "backgroundColor": "transparent",
                "borderRadius": "var(--wm-card-border-radius)"
            },
            "backgroundColor": "var(--wm-list-template-background-color)",
            "padding": "var(--wm-list-template-padding)",
            "minHeight": "var(--wm-list-template-min-height)",
            "borderRadius": "var(--wm-list-template-border-radius)",
            "borderColor": "var(--wm-list-template-border-color)",
            "borderStyle": "var(--wm-list-template-border-style)",
            "borderWidth": "var(--wm-list-template-border-width)",
            "boxShadow": "var(--wm-list-template-box-shadow)"
        }
    },
    "list-card-template": {
        "root": {
            "backgroundColor": "transparent",
            "borderRadius": "var(--wm-card-border-radius)"
        }
    },
    "form-label": {
        "text": {
            "fontSize": "var(--wm-form-controls-label-font-size)",
            "color": "var(--wm-form-controls-label-color)",
            "fontWeight": "var(--wm-form-controls-label-font-weight)",
            "fontFamily": "var(--wm-form-controls-label-font-family)"
        },
        "backgroundColor": "var(--wm-form-controls-label-background)",
        "marginTop": "var(--wm-form-controls-label-margin-vertical)",
        "marginBottom": "var(--wm-form-controls-label-margin-vertical)",
        "marginLeft": "var(--wm-form-controls-label-margin-horizontal)",
        "marginRight": "var(--wm-form-controls-label-margin-horizontal)"
    },
    "app-form": {
        "footer": {
            "root": {
                "borderColor": "var(--wm-form-footer-border-color)",
                "paddingLeft": "var(--wm-form-footer-padding-horizontal)",
                "paddingRight": "var(--wm-form-footer-padding-horizontal)",
                "paddingTop": "var(--wm-form-footer-padding-vertical)",
                "paddingBottom": "var(--wm-form-footer-padding-vertical)",
                "borderWidth": "var(--wm-form-footer-border-width)",
                "borderRadius": "var(--wm-form-footer-border-radius)",
                "backgroundColor": "var(--wm-form-footer-background)",
                "borderStyle": "var(--wm-form-footer-border-style)",
                "borderTopWidth": "var(--wm-form-footer-border-width)"
            }
        },
        "heading": {
            "borderColor": "var(--wm-form-header-border-color)",
            "paddingTop": "var(--wm-form-header-padding-vertical)",
            "paddingBottom": "var(--wm-form-header-padding-vertical)",
            "paddingLeft": "var(--wm-form-header-padding-horizontal)",
            "paddingRight": "var(--wm-form-header-padding-horizontal)",
            "borderRadius": "var(--wm-form-header-border-radius)",
            "borderStyle": "var(--wm-form-header-border-style)",
            "borderWidth": "var(--wm-form-header-border-width)",
            "backgroundColor": "var(--wm-form-header-background)",
            "borderBottomWidth": "var(--wm-form-header-border-width)"
        },
        "title": {
            "text": {
                "fontSize": "var(--wm-form-header-title-font-size)",
                "color": "var(--wm-form-header-title-color)",
                "fontWeight": "var(--wm-form-header-title-font-weight)",
                "fontFamily": "var(--wm-form-header-title-font-family)",
                "marginTop": "var(--wm-form-header-title-margin-vertical)",
                "marginBottom": "var(--wm-form-header-title-margin-vertical)",
                "marginLeft": "var(--wm-form-header-title-margin-horizontal)",
                "marginRight": "var(--wm-form-header-title-margin-horizontal)"
            }
        },
        "subheading": {
            "text": {
                "color": "var(--wm-form-header-sub-title-color)",
                "fontSize": "var(--wm-form-header-sub-title-font-size)",
                "fontWeight": "var(--wm-form-header-sub-title-font-weight)",
                "fontFamily": "var(--wm-form-header-sub-title-font-family)",
                "marginTop": "var(--wm-form-header-sub-title-margin-vertical)",
                "marginBottom": "var(--wm-form-header-sub-title-margin-vertical)",
                "marginLeft": "var(--wm-form-header-sub-title-margin-horizontal)",
                "marginRight": "var(--wm-form-header-sub-title-margin-horizontal)"
            }
        },
        "root": {
            "backgroundColor": "var(--wm-form-background)",
            "padding": "var(--wm-form-padding)",
            "borderRadius": "var(--wm-form-border-radius)",
            "borderWidth": "var(--wm-form-border-width)",
            "borderStyle": "var(--wm-form-border-style)",
            "borderColor": "var(--wm-form-border-color)",
            "boxShadow": "var(--wm-form-box-shadow)"
        },
        "body": {
            "root": {
                "paddingLeft": "var(--wm-form-body-padding-horizontal)",
                "paddingRight": "var(--wm-form-body-padding-horizontal)",
                "paddingTop": "var(--wm-form-body-padding-vertical)",
                "paddingBottom": "var(--wm-form-body-padding-vertical)",
                "borderWidth": "var(--wm-form-body-border-width)",
                "borderColor": "var(--wm-form-body-border-color)",
                "borderRadius": "var(--wm-form-body-border-radius)",
                "backgroundColor": "var(--wm-form-body-background)",
                "borderStyle": "var(--wm-form-body-border-style)"
            }
        }
    },
    "app-input": {
        "focused": {
            "--wm-form-controls-border-color": "var(--wm-color-primary)",
            "--wm-form-controls-border-width": "var(--wm-border-width-1)",
            "--wm-form-controls-background": "var(--wm-color-outline-variant)",
            "--wm-form-controls-color": "var(--wm-color-black)",
            "--wm-form-controls-floating-color": "var(--wm-color-surface-dim)",
            "--wm-form-controls-floating-font-size": "var(--wm-body-medium-font-size)",
            "--wm-form-controls-floating-font-weight": "var(--wm-body-medium-font-weight)",
            "--wm-form-controls-floating-font-family": "var(--wm-body-medium-font-family)",
            "--wm-form-controls-floating-top": "var(--wm-space-3)",
            "--wm-form-controls-floating-left": "var(--wm-space-4)",
            "--wm-form-controls-floating-padding": "var(--wm-space-0)",
            "borderWidth": "var(--wm-form-controls-border-width)",
            "borderColor": "var(--wm-form-controls-border-color)",
            "backgroundColor": "var(--wm-form-controls-background)",
            "opacity": "var(--wm-form-controls-opacity)",
            "minHeight": "var(--wm-form-controls-min-height)",
            "padding": "var(--wm-form-controls-padding)",
            "borderStyle": "var(--wm-form-controls-border-style)",
            "borderRadius": "var(--wm-form-controls-border-radius)",
            "color": "var(--wm-form-controls-color)",
            "fontFamily": "var(--wm-form-controls-font-family)",
            "fontWeight": "var(--wm-form-controls-font-weight)",
            "minWidth": "var(--wm-form-controls-min-width)",
            "lineHeight": "var(--wm-form-controls-font-line-height)",
            "letterSpacing": "var(--wm-form-controls-font-letter-spacing)"
        },
        "disabled": {
            "--wm-form-controls-opacity": 0.67,
            "--wm-form-controls-border-color": "var(--wm-color-shadow)",
            "--wm-form-controls-border-width": "var(--wm-border-width-1)",
            "--wm-form-controls-background": "var(--wm-color-surface-dim)",
            "--wm-form-controls-color": "var(--wm-color-scrim)",
            "minHeight": "var(--wm-form-controls-min-height)",
            "padding": "var(--wm-form-controls-padding)",
            "borderStyle": "var(--wm-form-controls-border-style)",
            "borderWidth": "var(--wm-form-controls-border-width)",
            "borderColor": "var(--wm-form-controls-border-color)",
            "borderRadius": "var(--wm-form-controls-border-radius)",
            "backgroundColor": "var(--wm-form-controls-background)",
            "color": "var(--wm-form-controls-color)",
            "opacity": "var(--wm-form-controls-opacity)",
            "fontSize": "var(--wm-form-controls-font-size)",
            "fontFamily": "var(--wm-form-controls-font-family)",
            "fontWeight": "var(--wm-form-controls-font-weight)",
            "minWidth": "var(--wm-form-controls-min-width)",
            "borderTopColor": "var(--wm-form-controls-border-color)",
            "borderLeftColor": "var(--wm-form-controls-border-color)",
            "borderBottomColor": "var(--wm-form-controls-border-color)",
            "borderRightColor": "var(--wm-form-controls-border-color)",
            "lineHeight": "var(--wm-form-controls-font-line-height)",
            "letterSpacing": "var(--wm-form-controls-font-letter-spacing)"
        },
        "root": {
            "minHeight": "var(--wm-form-controls-min-height)",
            "padding": "var(--wm-form-controls-padding)",
            "borderStyle": "var(--wm-form-controls-border-style)",
            "borderWidth": "var(--wm-form-controls-border-width)",
            "borderColor": "var(--wm-form-controls-border-color)",
            "borderRadius": "var(--wm-form-controls-border-radius)",
            "backgroundColor": "var(--wm-form-controls-background)",
            "color": "var(--wm-form-controls-color)",
            "opacity": "var(--wm-form-controls-opacity)",
            "minWidth": "var(--wm-form-controls-min-width)",
            "fontSize": "var(--wm-form-controls-font-size)",
            "fontFamily": "var(--wm-form-controls-font-family)",
            "fontWeight": "var(--wm-form-controls-font-weight)",
            "lineHeight": "var(--wm-form-controls-font-line-height)",
            "letterSpacing": "var(--wm-form-controls-font-letter-spacing)"
        },
        "text": {
            "color": "var(--wm-form-controls-color)",
            "fontSize": "var(--wm-form-controls-font-size)",
            "fontFamily": "var(--wm-form-controls-font-family)",
            "fontWeight": "var(--wm-form-controls-font-weight)",
            "lineHeight": "var(--wm-form-controls-font-line-height)",
            "letterSpacing": "var(--wm-form-controls-font-letter-spacing)"
        },
        "invalid": {
            "borderBottomColor": "#dc3545"
        }
    },
    "form-controls-filled": {
        "--wm-form-controls-min-height": 56,
        "--wm-form-controls-min-width": 210,
        "--wm-form-controls-border-width": "0 0 var(--wm-border-width-1) 0",
        "--wm-form-controls-opacity": "var(--wm-border-width-1)",
        "--wm-form-controls-padding": "var(--wm-space-4) var(--wm-space-4) 0 var(--wm-space-4)",
        "--wm-form-controls-border-color": "var(--wm-color-outline)",
        "--wm-form-controls-border-radius": "var(--wm-radius-sm) var(--wm-radius-sm) 0 0",
        "--wm-form-controls-border-style": "var(--wm-border-style-base)",
        "--wm-form-controls-placeholder-color": "var(--wm-color-on-surface-variant)",
        "--wm-form-controls-background": "var(--wm-color-surface-dim)",
        "--wm-form-controls-color": "var(--wm-color-black)",
        "--wm-form-controls-floating-color": "var(--wm-color-on-surface-variant)",
        "--wm-form-controls-floating-top": "var(--wm-space-5)",
        "--wm-form-controls-floating-left": "var(--wm-space-3)",
        "--wm-form-controls-label-color": "var(--wm-color-on-surface-variant)",
        "--wm-form-controls-label-background": "var(--wm-color-transparent)",
        "--wm-form-controls-label-font-size": "var(--wm-label-large-font-size)",
        "--wm-form-controls-label-font-weight": "var(--wm-label-large-font-weight)",
        "--wm-form-controls-label-font-family": "var(--wm-label-large-font-family)",
        "--wm-form-controls-label-margin-vertical": "var(--wm-space-0)",
        "--wm-form-controls-label-margin-horizontal": "var(--wm-space-0)",
        "focused": {
            "--wm-form-controls-min-height": 56,
            "--wm-form-controls-min-width": 210,
            "--wm-form-controls-border-width": "0 0 var(--wm-border-width-2) 0",
            "--wm-form-controls-border-style": "var(--wm-border-style-base)",
            "--wm-form-controls-border-radius": "var(--wm-radius-sm) var(--wm-radius-sm) 0 0",
            "--wm-form-controls-floating-color": "var(--wm-color-outline)",
            "--wm-form-controls-floating-top": "var(--wm-space-5)",
            "--wm-form-controls-floating-left": "var(--wm-space-3)",
            "--wm-form-controls-label-color": "var(--wm-color-outline)",
            "--wm-form-controls-padding": "var(--wm-space-4) var(--wm-space-4) 0 var(--wm-space-4)"
        },
        "disabled": {
            "--wm-form-controls-border-width": "0 0 var(--wm-border-width-1) 0",
            "--wm-form-controls-opacity": 0.67,
            "--wm-form-controls-border-color": "var(--wm-color-shadow)",
            "--wm-form-controls-background": "var(--wm-color-surface-dim)",
            "--wm-form-controls-color": "var(--wm-color-scrim)"
        }
    },
    "form-controls-outlined": {
        "--wm-form-controls-opacity": 1,
        "--wm-form-controls-min-height": 56,
        "--wm-form-controls-min-width": 210,
        "--wm-form-controls-font-size": "var(--wm-body-large-font-size)",
        "--wm-form-controls-font-weight": "var(--wm-body-large-font-weight)",
        "--wm-form-controls-font-family": "var(--wm-body-large-font-family)",
        "--wm-form-controls-padding": "var(--wm-space-4)",
        "--wm-form-controls-border": "var(--wm-border-width-1)",
        "--wm-form-controls-placeholder-color": "var(--wm-color-on-surface)",
        "--wm-form-controls-background": "var(--wm-color-white)",
        "--wm-form-controls-color": "var(--wm-color-black)",
        "--wm-form-controls-label-color": "var(--wm-color-on-surface)",
        "--wm-form-controls-label-background": "var(--wm-color-transparent)",
        "--wm-form-controls-floating-color": "var(--wm-color-surface-dim)",
        "--wm-form-controls-floating-top": "var(--wm-space-5)",
        "--wm-form-controls-floating-left": "var(--wm-space-4)",
        "focused": {
            "--wm-form-controls-min-height": 56,
            "--wm-form-controls-min-width": 210,
            "--wm-form-controls-border-color": "var(--wm-color-secondary)",
            "--wm-form-controls-border-width": "var(--wm-border-width-1)",
            "--wm-form-controls-padding": "var(--wm-space-4)",
            "--wm-form-controls-background": "var(--wm-color-white)",
            "--wm-form-controls-color": "var(--wm-color-black)",
            "--wm-form-controls-floating-color": "var(--wm-color-primary)",
            "--wm-form-controls-floating-top": "var(--wm-space-5)",
            "--wm-form-controls-floating-left": "var(--wm-space-4)"
        },
        "disabled": {
            "--wm-form-controls-border": "1px solid var(--wm-color-shadow)",
            "--wm-form-controls-opacity": 0.67,
            "--wm-form-controls-background": "var(--wm-color-white)",
            "--wm-form-controls-color": "var(--wm-color-scrim)"
        }
    },
    "app-form-field": {
        "root": {
            "minHeight": "var(--wm-form-field-height)",
            "boxShadow": "var(--wm-form-controls-field-box-shadow)",
            "borderRadius": "var(--wm-form-controls-field-radius)",
            "marginLeft": "var(--wm-form-field-margin-horizontal)",
            "marginRight": "var(--wm-form-field-margin-horizontal)",
            "marginTop": "var(--wm-form-field-margin-vertical)",
            "marginBottom": "var(--wm-form-field-margin-vertical)",
            "paddingLeft": "var(--wm-form-field-padding-horizontal)",
            "paddingRight": "var(--wm-form-field-padding-horizontal)",
            "paddingTop": "var(--wm-form-field-padding-vertical)",
            "paddingBottom": "var(--wm-form-field-padding-vertical)"
        },
        "errorMsg": {
            "color": "var(--wm-form-error-color)",
            "fontSize": "var(--wm-form-error-font-size)",
            "paddingTop": "var(--wm-form-error-padding-top)",
            "paddingBottom": "var(--wm-form-error-padding-bottom)",
            "paddingLeft": "var(--wm-form-error-padding-left)",
            "paddingRight": "var(--wm-form-error-padding-right)"
        }
    },
    "app-text": {
        "placeholderText": {
            "color": "var(--wm-form-controls-placeholder-color)"
        },
        "root": {
            "borderColor": "#ddd",
            "backgroundColor": "#fff"
        },
        "invalid": {
            "borderBottomColor": "#dc3545"
        },
        "focused": {
            "borderColor": "#4263eb"
        }
    },
    "app-textarea": {
        "placeholderText": {
            "color": "#bbb"
        },
        "root": {
            "borderColor": "#ddd",
            "backgroundColor": "#fff"
        },
        "invalid": {
            "borderBottomColor": "red"
        },
        "focused": {
            "borderColor": "#4263eb"
        }
    },
    "app-number": {
        "placeholderText": {
            "color": "#bbb"
        },
        "root": {
            "borderColor": "#ddd",
            "backgroundColor": "#fff"
        },
        "invalid": {
            "borderBottomColor": "#dc3545"
        },
        "focused": {
            "borderColor": "#4263eb"
        }
    },
    "app-date": {
        "placeholderText": {
            "color": "var(--wm-form-controls-placeholder-color)"
        },
        "root": {
            "backgroundColor": "#fff",
            "borderColor": "#ddd"
        },
        "text": {
            "color": "#151420"
        },
        "invalid": {
            "borderBottomColor": "#dc3545"
        }
    },
    "app-datetime": {
        "placeholderText": {
            "color": "var(--wm-form-controls-placeholder-color)"
        },
        "root": {
            "backgroundColor": "#fff",
            "borderColor": "#ddd"
        },
        "text": {
            "color": "#151420"
        },
        "invalid": {
            "borderBottomColor": "#dc3545"
        }
    },
    "app-time": {
        "placeholderText": {
            "color": "var(--wm-form-controls-placeholder-color)"
        },
        "root": {
            "backgroundColor": "#fff",
            "borderColor": "#ddd"
        },
        "text": {
            "color": "#151420"
        },
        "invalid": {
            "borderBottomColor": "#dc3545"
        }
    },
    "app-currency": {
        "placeholderText": {
            "color": "#bbb"
        },
        "root": {
            "borderWidth": "var(--wm-space-0)",
            "borderColor": "#ddd",
            "backgroundColor": "#fff"
        },
        "label": {
            "backgroundColor": "var(--wm-currency-labelwrapper-background)",
            "color": "var(--wm-currency-label-color)",
            "fontWeight": "var(--wm-currency-label-font-weight)",
            "fontFamily": "var(--wm-currency-label-font-family)",
            "fontSize": "var(--wm-currency-label-font-size)"
        },
        "invalid": {
            "borderBottomColor": "#dc3545"
        },
        "focused": {
            "borderColor": "#4263eb"
        },
        "labelWrapper": {
            "backgroundColor": "var(--wm-currency-labelwrapper-background)",
            "minHeight": "var(--wm-currency-labelwrapper-min-height)",
            "borderRadius": "var(--wm-currency-labelwrapper-border-radius)",
            "padding": "var(--wm-currency-labelwrapper-padding)",
            "width": "var(--wm-currency-labelwrapper-width)"
        }
    },
    "app-select": {
        "placeholderText": {
            "color": "var(--wm-form-controls-placeholder-color)"
        },
        "root": {
            "borderColor": "#ddd",
            "backgroundColor": "#fff"
        },
        "invalid": {
            "borderBottomColor": "#dc3545"
        },
        "selectedItem": {
            "--wm-select-modal-text-color": "var(--wm-color-primary)",
            "--wm-select-modal-text-font-size": "var(--wm-body-large-font-size)",
            "--wm-select-modal-text-font-family": "var(--wm-body-medium-font-family)",
            "--wm-select-modal-text-line-height": "var(--wm-body-large-line-height)",
            "--wm-select-modal-text-letter-spacing": "var(--wm-body-large-letter-spacing)"
        },
        "selectedItemText": {
            "--wm-select-modal-text-color": "var(--wm-color-primary)",
            "--wm-select-modal-text-font-size": "var(--wm-body-large-font-size)",
            "--wm-select-modal-text-font-family": "var(--wm-body-medium-font-family)",
            "--wm-select-modal-text-line-height": "var(--wm-body-large-line-height)",
            "--wm-select-modal-text-letter-spacing": "var(--wm-body-large-letter-spacing)",
            "fontSize": "var(--wm-select-modal-text-font-size)",
            "color": "var(--wm-select-modal-text-color)",
            "fontFamily": "var(--wm-select-modal-text-font-family)",
            "lineHeight": "var(--wm-select-modal-text-line-height)",
            "letterSpacing": "var(--wm-select-modal-text-letter-spacing)"
        },
        "arrowButton": {
            "root": {
                "backgroundColor": "var(--wm-select-arrow-button-background-color)",
                "padding": "var(--wm-select-arrow-button-padding)",
                "borderWidth": "var(--wm-select-arrow-button-border-width)",
                "borderStyle": "var(--wm-select-arrow-button-border-style)",
                "borderColor": "var(--wm-select-arrow-button-border-color)",
                "borderRadius": "var(--wm-select-arrow-button-border-radius)"
            },
            "icon": {
                "icon": {
                    "fontSize": "var(--wm-select-arrow-button-icon-font-size)",
                    "color": "var(--wm-select-arrow-button-icon-color)",
                    "height": "var(--wm-select-arrow-button-icon-height)",
                    "borderWidth": "var(--wm-select-arrow-button-icon-border-width)",
                    "borderStyle": "var(--wm-select-arrow-button-icon-border-style)",
                    "borderColor": "var(--wm-select-arrow-button-icon-border-color)",
                    "borderRadius": "var(--wm-select-arrow-button-icon-border-radius)",
                    "padding": "var(--wm-select-arrow-button-icon-padding)"
                }
            }
        },
        "modalContent": {
            "backgroundColor": "var(--wm-select-modal-content-background-color)",
            "borderColor": "var(--wm-select-modal-content-border-color)",
            "borderRadius": "var(--wm-select-modal-content-border-radius)",
            "borderStyle": "var(--wm-select-modal-content-border-style)",
            "borderWidth": "var(--wm-select-modal-content-border-width)",
            "boxShadow": "var(--wm-select-modal-content-box-shadow)"
        },
        "selectItem": {
            "borderWidth": "var(--wm-select-item-border-width)",
            "borderColor": "var(--wm-select-item-border-color)",
            "borderStyle": "var(--wm-select-item-border-style)",
            "padding": "var(--wm-select-item-padding)"
        },
        "lastSelectItem": {
            "borderWidth": "var(--wm-select-item-border-width)",
            "borderColor": "var(--wm-select-item-border-color)",
            "borderStyle": "var(--wm-select-item-border-style)",
            "padding": "var(--wm-select-item-padding)"
        },
        "selectItemText": {
            "fontSize": "var(--wm-select-modal-text-font-size)",
            "color": "var(--wm-select-modal-text-color)",
            "fontFamily": "var(--wm-select-modal-text-font-family)",
            "lineHeight": "var(--wm-select-modal-text-line-height)",
            "letterSpacing": "var(--wm-select-modal-text-letter-spacing)"
        },
        "checkIcon": {
            "root": {
                "justifyContent": "center",
                "alignItems": "center",
                "backgroundColor": "var(--wm-select-check-icon-background-color)",
                "height": "var(--wm-select-check-icon-height)",
                "width": "var(--wm-select-check-icon-width)",
                "borderRadius": "var(--wm-select-check-icon-border-radius)",
                "borderWidth": "var(--wm-select-check-icon-border-width)",
                "borderColor": "var(--wm-select-check-icon-border-color)",
                "borderStyle": "var(--wm-select-check-icon-border-style)",
                "padding": "var(--wm-select-check-icon-padding)"
            },
            "icon": {
                "fontSize": "var(--wm-select-check-icon-font-size)",
                "color": "var(--wm-select-check-icon-color)"
            }
        }
    },
    "control-label": {
        "text": {
            "color": "var(--wm-form-controls-label-color)",
            "backgroundColor": "var(--wm-form-controls-label-background)",
            "fontSize": "var(--wm-form-controls-label-font-size)",
            "fontWeight": "var(--wm-form-controls-label-font-weight)",
            "fontFamily": "var(--wm-form-controls-label-font-family)",
            "marginTop": "var(--wm-form-controls-label-margin-vertical)",
            "marginBottom": "var(--wm-form-controls-label-margin-vertical)",
            "marginLeft": "var(--wm-form-controls-label-margin-horizontal)",
            "marginRight": "var(--wm-form-controls-label-margin-horizontal)"
        }
    },
    "app-select-disabled": {
        "minHeight": "var(--wm-form-controls-min-height)",
        "padding": "var(--wm-form-controls-padding)",
        "borderStyle": "var(--wm-form-controls-border-style)",
        "borderWidth": "var(--wm-form-controls-border-width)",
        "borderColor": "var(--wm-form-controls-border-color)",
        "backgroundColor": "var(--wm-form-controls-background)",
        "color": "var(--wm-form-controls-color)",
        "opacity": "var(--wm-form-controls-opacity)",
        "fontSize": "var(--wm-form-controls-font-size)",
        "fontFamily": "var(--wm-form-controls-font-family)",
        "fontWeight": "var(--wm-form-controls-font-weight)",
        "minWidth": "var(--wm-form-controls-min-width)",
        "lineHeight": "var(--wm-form-controls-font-line-height)",
        "letterSpacing": "var(--wm-form-controls-font-letter-spacing)"
    },
    "app-text-with-label": {
        "floatingLabel": {
            "padding": "var(--wm-form-controls-floating-padding)",
            "left": "var(--wm-form-controls-floating-left)",
            "top": "var(--wm-form-controls-floating-top)",
            "color": "var(--wm-form-controls-floating-color)",
            "fontSize": "var(--wm-form-controls-floating-font-size)",
            "fontFamily": "var(--wm-form-controls-floating-font-family)",
            "fontWeight": "var(--wm-form-controls-floating-font-weight)"
        },
        "activeFloatingLabel": {
            "padding": "var(--wm-form-controls-floating-padding)",
            "left": "var(--wm-form-controls-floating-left)",
            "top": "var(--wm-form-controls-floating-top)",
            "color": "var(--wm-form-controls-floating-color)",
            "fontSize": "var(--wm-form-controls-floating-font-size)",
            "fontFamily": "var(--wm-form-controls-floating-font-family)",
            "fontWeight": "var(--wm-form-controls-floating-font-weight)"
        }
    },
    "app-number-with-label": {
        "floatingLabel": {
            "padding": "var(--wm-form-controls-floating-padding)",
            "left": "var(--wm-form-controls-floating-left)",
            "top": "var(--wm-form-controls-floating-top)",
            "color": "var(--wm-form-controls-floating-color)",
            "fontSize": "var(--wm-form-controls-floating-font-size)",
            "fontFamily": "var(--wm-form-controls-floating-font-family)",
            "fontWeight": "var(--wm-form-controls-floating-font-weight)"
        },
        "activeFloatingLabel": {
            "padding": "var(--wm-form-controls-floating-padding)",
            "left": "var(--wm-form-controls-floating-left)",
            "top": "var(--wm-form-controls-floating-top)",
            "color": "var(--wm-form-controls-floating-color)",
            "fontSize": "var(--wm-form-controls-floating-font-size)",
            "fontFamily": "var(--wm-form-controls-floating-font-family)",
            "fontWeight": "var(--wm-form-controls-floating-font-weight)"
        }
    },
    "app-currency-with-label": {
        "floatingLabel": {
            "padding": "var(--wm-form-controls-floating-padding)",
            "left": "var(--wm-form-controls-floating-left)",
            "top": "var(--wm-form-controls-floating-top)",
            "color": "var(--wm-form-controls-floating-color)",
            "fontSize": "var(--wm-form-controls-floating-font-size)",
            "fontFamily": "var(--wm-form-controls-floating-font-family)",
            "fontWeight": "var(--wm-form-controls-floating-font-weight)"
        },
        "activeFloatingLabel": {
            "padding": "var(--wm-form-controls-floating-padding)",
            "left": "var(--wm-form-controls-floating-left)",
            "top": "var(--wm-form-controls-floating-top)",
            "color": "var(--wm-form-controls-floating-color)",
            "fontSize": "var(--wm-form-controls-floating-font-size)",
            "fontFamily": "var(--wm-form-controls-floating-font-family)",
            "fontWeight": "var(--wm-form-controls-floating-font-weight)"
        }
    },
    "app-textarea-with-label": {
        "floatingLabel": {
            "padding": "var(--wm-form-controls-floating-padding)",
            "left": "var(--wm-form-controls-floating-left)",
            "top": "var(--wm-form-controls-floating-top)",
            "color": "var(--wm-form-controls-floating-color)",
            "fontSize": "var(--wm-form-controls-floating-font-size)",
            "fontFamily": "var(--wm-form-controls-floating-font-family)",
            "fontWeight": "var(--wm-form-controls-floating-font-weight)"
        },
        "activeFloatingLabel": {
            "padding": "var(--wm-form-controls-floating-padding)",
            "left": "var(--wm-form-controls-floating-left)",
            "top": "var(--wm-form-controls-floating-top)",
            "color": "var(--wm-form-controls-floating-color)",
            "fontSize": "var(--wm-form-controls-floating-font-size)",
            "fontFamily": "var(--wm-form-controls-floating-font-family)",
            "fontWeight": "var(--wm-form-controls-floating-font-weight)"
        }
    },
    "app-date-with-label": {
        "floatingLabel": {
            "padding": "var(--wm-form-controls-floating-padding)",
            "left": "var(--wm-form-controls-floating-left)",
            "top": "var(--wm-form-controls-floating-top)",
            "color": "var(--wm-form-controls-floating-color)",
            "fontSize": "var(--wm-form-controls-floating-font-size)",
            "fontFamily": "var(--wm-form-controls-floating-font-family)",
            "fontWeight": "var(--wm-form-controls-floating-font-weight)"
        },
        "activeFloatingLabel": {
            "padding": "var(--wm-form-controls-floating-padding)",
            "left": "var(--wm-form-controls-floating-left)",
            "top": "var(--wm-form-controls-floating-top)",
            "color": "var(--wm-form-controls-floating-color)",
            "fontSize": "var(--wm-form-controls-floating-font-size)",
            "fontFamily": "var(--wm-form-controls-floating-font-family)",
            "fontWeight": "var(--wm-form-controls-floating-font-weight)"
        }
    },
    "app-time-with-label": {
        "floatingLabel": {
            "padding": "var(--wm-form-controls-floating-padding)",
            "left": "var(--wm-form-controls-floating-left)",
            "top": "var(--wm-form-controls-floating-top)",
            "color": "var(--wm-form-controls-floating-color)",
            "fontSize": "var(--wm-form-controls-floating-font-size)",
            "fontFamily": "var(--wm-form-controls-floating-font-family)",
            "fontWeight": "var(--wm-form-controls-floating-font-weight)"
        },
        "activeFloatingLabel": {
            "padding": "var(--wm-form-controls-floating-padding)",
            "left": "var(--wm-form-controls-floating-left)",
            "top": "var(--wm-form-controls-floating-top)",
            "color": "var(--wm-form-controls-floating-color)",
            "fontSize": "var(--wm-form-controls-floating-font-size)",
            "fontFamily": "var(--wm-form-controls-floating-font-family)",
            "fontWeight": "var(--wm-form-controls-floating-font-weight)"
        }
    },
    "app-datetime-with-label": {
        "floatingLabel": {
            "padding": "var(--wm-form-controls-floating-padding)",
            "left": "var(--wm-form-controls-floating-left)",
            "top": "var(--wm-form-controls-floating-top)",
            "color": "var(--wm-form-controls-floating-color)",
            "fontSize": "var(--wm-form-controls-floating-font-size)",
            "fontFamily": "var(--wm-form-controls-floating-font-family)",
            "fontWeight": "var(--wm-form-controls-floating-font-weight)"
        },
        "activeFloatingLabel": {
            "padding": "var(--wm-form-controls-floating-padding)",
            "left": "var(--wm-form-controls-floating-left)",
            "top": "var(--wm-form-controls-floating-top)",
            "color": "var(--wm-form-controls-floating-color)",
            "fontSize": "var(--wm-form-controls-floating-font-size)",
            "fontFamily": "var(--wm-form-controls-floating-font-family)",
            "fontWeight": "var(--wm-form-controls-floating-font-weight)"
        }
    },
    "app-list": {
        "loadingIcon": {
            "text": {
                "color": "#666"
            }
        },
        "heading": {
            "backgroundColor": "#fff"
        },
        "groupHeading": {
            "backgroundColor": "transparent"
        },
        "title": {
            "text": {
                "color": "#333"
            }
        },
        "subheading": {
            "text": {
                "color": "#666"
            }
        },
        "emptyMessage": {
            "text": {
                "color": "#666"
            }
        },
        "onDemandMessage": {
            "text": {
                "color": "#666"
            }
        },
        "root": {
            "borderStyle": "var(--wm-list-border-style)",
            "backgroundColor": "var(--wm-list-background-color)",
            "padding": "var(--wm-list-padding)",
            "borderRadius": "var(--wm-list-border-radius)",
            "borderColor": "var(--wm-list-border-color)",
            "borderWidth": "var(--wm-list-border-width)"
        }
    },
    "app-barcodescanner": {
        "button": {
            "root": {
                "backgroundColor": "var(--wm-barcodescanner-background)",
                "borderColor": "var(--wm-barcodescanner-border-color)",
                "display": "flex",
                "justifyContent": "center",
                "alignItems": "center",
                "padding": "var(--wm-barcodescanner-padding)",
                "minHeight": "var(--wm-barcodescanner-min-height)",
                "borderWidth": "var(--wm-barcodescanner-border-width)",
                "borderStyle": "var(--wm-barcodescanner-border-style)",
                "borderRadius": "var(--wm-barcodescanner-border-radius)",
                "minWidth": "var(--wm-barcodescanner-min-width)",
                "rippleColor": "var(--wm-barcodescanner-ripple-color)",
                "gap": "var(--wm-spacer-2)"
            },
            "text": {
                "color": "var(--wm-barcodescanner-text-color)",
                "fontSize": "var(--wm-barcodescanner-text-font-size)",
                "padding": "var(--wm-barcodescanner-text-padding)",
                "lineHeight": "var(--wm-barcodescanner-text-font-size)"
            },
            "icon": {
                "icon": {
                    "color": "var(--wm-barcodescanner-icon-color)",
                    "fontSize": "var(--wm-barcodescanner-icon-font-size)"
                }
            }
        }
    },
    "app-camera": {
        "button": {
            "root": {
                "backgroundColor": "var(--wm-camera-background)",
                "borderColor": "var(--wm-camera-border-color)",
                "borderWidth": "var(--wm-camera-border-width)",
                "borderRadius": "var(--wm-camera-border-radius)",
                "minHeight": "var(--wm-camera-min-height)",
                "minWidth": "var(--wm-camera-min-width)",
                "padding": "var(--wm-camera-padding)",
                "rippleColor": "var(--wm-camera-ripple-color)"
            },
            "text": {
                "color": "var(--wm-camera-color)"
            },
            "icon": {
                "icon": {
                    "color": "var(--wm-camera-color)"
                }
            }
        }
    },
    "app-alertdialog": {
        "message": {
            "text": {
                "color": "var(--wm-modal-description-color)",
                "fontWeight": "var(--wm-modal-description-font-weight)",
                "fontFamily": "var(--wm-modal-description-font-family)",
                "fontSize": "var(--wm-modal-description-font-size)",
                "padding": "var(--wm-modal-description-padding)",
                "borderStyle": "var(--wm-modal-description-border-style)",
                "borderWidth": "var(--wm-modal-description-border-width)",
                "borderColor": "var(--wm-modal-description-border-color)",
                "backgroundColor": "var(--wm-modal-description-background)"
            }
        },
        "okButton": {
            "root": {
                "backgroundColor": "var(--wm-modal-btn-ok-background)"
            }
        }
    },
    "app-confirmdialog": {
        "message": {
            "text": {
                "color": "var(--wm-modal-description-color)",
                "fontWeight": "var(--wm-modal-description-font-weight)",
                "fontFamily": "var(--wm-modal-description-font-family)",
                "fontSize": "var(--wm-modal-description-font-size)",
                "padding": "var(--wm-modal-description-padding)",
                "borderStyle": "var(--wm-modal-description-border-style)",
                "borderWidth": "var(--wm-modal-description-border-width)",
                "borderColor": "var(--wm-modal-description-border-color)",
                "backgroundColor": "var(--wm-modal-description-background)"
            }
        },
        "cancelButton": {
            "root": {
                "backgroundColor": "var(--wm-modal-btn-cancel-background)"
            },
            "text": {
                "color": "var(--wm-modal-btn-cancel-color)"
            }
        },
        "dialogActions": {
            "root": {
                "padding": "var(--wm-modal-footer-padding)"
            }
        }
    },
    "app-dialog": {
        "root": {
            "backgroundColor": "var(--wm-modal-background)",
            "borderRadius": "var(--wm-modal-radius)",
            "padding": "var(--wm-modal-body-padding)",
            "minWidth": "var(--wm-modal-min-width)"
        },
        "header": {
            "borderColor": "var(--wm-modal-header-border-color)",
            "padding": "var(--wm-modal-header-padding)",
            "borderStyle": "var(--wm-modal-header-border-style)",
            "borderWidth": "var(--wm-modal-header-border-width)",
            "backgroundColor": "var(--wm-modal-header-background)"
        },
        "modal": {
            "backgroundColor": "var(--wm-modal-dialog-overlay-background)"
        },
        "headerLabel": {
            "paddingBottom": "var(--wm-modal-header-label-padding-bottom)"
        },
        "icon": {
            "icon": {
                "fontSize": "var(--wm-modal-icon-font-size)",
                "color": "var(--wm-modal-icon-color)"
            },
            "text": {
                "maxWidth": "unset",
                "paddingTop": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "fontSize": "var(--wm-modal-title-font-size)",
                "fontWeight": "var(--wm-modal-title-font-weight)",
                "color": "var(--wm-modal-title-color)",
                "letterSpacing": "var(--wm-modal-title-letter-spacing)",
                "lineHeight": "var(--wm-modal-title-line-height)",
                "fontFamily": "var(--wm-modal-title-font-family)"
            }
        },
        "closeBtn": {
            "root": {
                "borderWidth": "var(--wm-modal-header-close-btn-border-width)",
                "borderColor": "var(--wm-modal-header-close-btn-border-color)",
                "borderStyle": "var(--wm-modal-header-close-btn-border-style)",
                "backgroundColor": "var(--wm-modal-header-close-btn-background)"
            },
            "content": {
                "minHeight": "unset"
            },
            "icon": {
                "root": {
                    "minWidth": "unset"
                },
                "icon": {
                    "fontSize": "var(--wm-modal-header-close-btn-font-size)",
                    "color": "var(--wm-modal-header-close-btn-color)"
                }
            }
        }
    },
    "app-dialogcontent": {
        "root": {
            "padding": "var(--wn-modal-body-padding)"
        }
    },
    "btn-only-label": {
        "text": {
            "color": "var(--wm-modal-btn-ok-color)"
        },
        "root": {
            "backgroundColor": "var(--wm-modal-btn-ok-background)"
        }
    },
    "app-dialog-footer": {
        "display": "flex",
        "flexDirection": "row",
        "justifyContent": "flex-end",
        "padding": "var(--wm-modal-footer-padding)",
        "gap": "var(--wm-modal-footer-gap)",
        "borderColor": "var(--wm-color-primary)"
    },
    "app-dialogactions": {
        "root": {
            "padding": "var(--wm-modal-footer-padding)",
            "borderColor": "#ccc"
        }
    },
    "app-calendar": {
        "text": {
            "color": "calendarDateColor"
        },
        "calendar": {
            "backgroundColor": "var(--wm-calendar-wrapper-background)",
            "borderColor": "var(--wm-calendar-wrapper-border-color)",
            "boxShadow": "var(--wm-calendar-wrapper-shadow)",
            "borderStyle": "var(--wm-calendar-wrapper-border-style)",
            "borderRadius": "var(--wm-calendar-wrapper-border-radius)",
            "borderWidth": "var(--wm-calendar-wrapper-border-width)"
        },
        "calendarHeader": {
            "backgroundColor": "var(--wm-calendar-header-background-color)",
            "borderColor": "var(--wm-calendar-header-border-color)",
            "boxShadow": "none",
            "borderRadius": "var(--wm-calendar-header-border-radius)",
            "padding": "var(--wm-calendar-header-padding)",
            "borderWidth": "var(--wm-calendar-header-border-width)",
            "borderStyle": "var(--wm-calendar-header-border-style)"
        },
        "weekDay": {
            "backgroundColor": "var(--wm-calendar-weekday-background-color)",
            "borderColor": "var(--wm-calendar-weekday-border-color)",
            "borderWidth": "var(--wm-calendar-weekday-border-width)",
            "borderStyle": "var(--wm-calendar-weekday-border-style)",
            "padding": "var(--wm-calendar-weekday-padding)"
        },
        "weekDayText": {
            "color": "var(--wm-calendar-weekday-text-color)",
            "fontWeight": "var(--wm-calendar-weekday-text-font-weight)",
            "fontFamily": "var(--wm-calendar-weekday-text-font-family)",
            "fontSize": "var(--wm-calendar-weekday-text-font-size)"
        },
        "dayWrapper": {
            "backgroundColor": "var(--wm-calendar-daywrapper-background)",
            "color": "#000",
            "borderColor": "var(--wm-calendar-daywrapper-border-color)",
            "borderWidth": "var(--wm-space-1)",
            "borderStyle": "var(--wm-border-style-solid)"
        },
        "day": {
            "backgroundColor": "var(--wm-calendar-day-background)",
            "color": "var(--wm-calendar-not-day-of-month-color)",
            "fontSize": "var(--wm-calendar-day-font-size)",
            "fontWeight": "var(--wm-calendar-not-day-of-month-font-weight)",
            "fontFamily": "var(--wm-calendar-day-font-family)",
            "borderColor": "var(--wm-calendar-day-border-color)"
        },
        "monthText": {
            "color": "var(--wm-calendar-month-text-color)",
            "fontWeight": "var(--wm-calendar-month-text-font-weight)",
            "fontFamily": "var(--wm-calendar-month-text-font-family)"
        },
        "yearText": {
            "color": "var(--wm-calendar-year-text-color)",
            "fontWeight": "var(--wm-calendar-year-text-font-weight)",
            "fontFamily": "var(--wm-calendar-year-text-font-family)"
        },
        "today": {
            "backgroundColor": "var(--wm-calendar-today-background-color)",
            "borderColor": "var(--wm-calendar-today-border-color)"
        },
        "todayText": {
            "backgroundColor": "var(--wm-calendar-today-text-background-color)"
        },
        "eventDay1": {
            "color": "var(--wm-calendar-event-day1-color1)"
        },
        "eventDay2": {
            "color": "var(--wm-calendar-event-day1-color2)"
        },
        "eventDay3": {
            "color": "var(--wm-calendar-event-day1-color3)"
        },
        "selectedDay": {
            "backgroundColor": "var(--wm-calendar-selected-day-background)",
            "borderColor": "var(--wm-calendar-selected-day-background)"
        },
        "selectedDayText": {
            "color": "var(--wm-calendar-selected-day-text-color)",
            "backgroundColor": "var(--wm-calendar-selected-day-text-background)",
            "borderColor": "var(--wm-calendar-selected-day-text-background)",
            "fontWeight": "var(--wm-calendar-selected-day-text-font-weight)"
        },
        "prevMonthBtn": {
            "text": {
                "color": "#aaa"
            }
        },
        "nextMonthBtn": {
            "text": {
                "color": "#aaa"
            }
        },
        "nextYearBtn": {
            "text": {
                "color": "#aaa"
            }
        },
        "root": {
            "width": "var(--wm-calendar-width)",
            "minHeight": "var(--wm-calendar-min-height)"
        }
    },
    "app-checkbox": {
        "text": {
            "color": "var(--wm-checkbox-label-color)",
            "marginLeft": "var(--wm-checkbox-label-margin-left)",
            "fontSize": "var(--wm-checkbox-label-font-size)",
            "fontFamily": "var(--wm-checkbox-label-font-family)"
        },
        "checkicon": {
            "--wm-checkbox-background-color": "var(--wm-color-primary)",
            "--wm-checkbox-border-color": "var(--wm-color-primary)",
            "--wm-checkbox-icon-color": "var(--wm-color-on-primary)",
            "--wm-checkbox-label-font-size": "var(--wm-body-large-font-size)",
            "--wm-checkbox-label-font-family": "var(--wm-body-large-font-family)",
            "--wm-checkbox-label-color": "var(--wm-color-on-surface-variant)",
            "root": {
                "width": "var(--wm-checkbox-width)",
                "height": "var(--wm-checkbox-height)",
                "backgroundColor": "var(--wm-checkbox-background-color)",
                "borderColor": "var(--wm-checkbox-border-color)",
                "borderWidth": "var(--wm-checkbox-border-width)",
                "borderRadius": "var(--wm-checkbox-border-radius)"
            },
            "icon": {
                "fontSize": "var(--wm-checkbox-icon-size)",
                "color": "var(--wm-checkbox-icon-color)"
            }
        },
        "selectedLabel": {
            "--wm-checkbox-background-color": "var(--wm-color-primary)",
            "--wm-checkbox-border-color": "var(--wm-color-primary)",
            "--wm-checkbox-icon-color": "var(--wm-color-on-primary)",
            "--wm-checkbox-label-font-size": "var(--wm-body-large-font-size)",
            "--wm-checkbox-label-font-family": "var(--wm-body-large-font-family)",
            "--wm-checkbox-label-color": "var(--wm-color-on-surface-variant)",
            "marginLeft": "var(--wm-checkbox-label-margin-left)",
            "fontSize": "var(--wm-checkbox-label-font-size)",
            "fontFamily": "var(--wm-checkbox-label-font-family)",
            "color": "var(--wm-checkbox-label-color)"
        },
        "uncheckicon": {
            "root": {
                "width": "var(--wm-checkbox-width)",
                "height": "var(--wm-checkbox-height)",
                "backgroundColor": "var(--wm-checkbox-background-color)",
                "borderColor": "var(--wm-checkbox-border-color)",
                "borderWidth": "var(--wm-checkbox-border-width)",
                "borderRadius": "var(--wm-checkbox-border-radius)"
            },
            "icon": {
                "color": "var(--wm-checkbox-icon-color)"
            }
        }
    },
    "app-checkbox-disabled": {
        "--wm-checkbox-opacity": 0.8,
        "--wm-checkbox-label-font-size": "var(--wm-body-large-font-size)",
        "--wm-checkbox-label-font-family": "var(--wm-body-large-font-family)",
        "--wm-checkbox-label-color": "var(--wm-color-on-surface-variant)",
        "root": {
            "opacity": "var(--wm-checkbox-opacity)",
            "borderColor": "var(--wm-checkbox-border-color)"
        }
    },
    "app-checkboxset": {
        "groupHeaderTitle": {
            "backgroundColor": "var(--wm-checkboxset-title-background-color)",
            "color": "var(--wm-checkboxset-title-color)",
            "padding": "var(--wm-checkboxset-title-padding)",
            "fontSize": "var(--wm-checkboxset-title-font-size)",
            "fontFamily": "var(--wm-checkboxset-title-font-family)"
        },
        "checkicon": {
            "--wm-checkboxset-background-color": "var(--wm-color-primary)",
            "--wm-checkboxset-border-color": "var(--wm-color-primary)",
            "--wm-checkboxset-icon-color": "var(--wm-color-on-primary)",
            "--wm-checkboxset-label-font-size": "var(--wm-body-large-font-size)",
            "--wm-checkboxset-label-font-family": "var(--wm-body-large-font-family)",
            "--wm-checkboxset-label-font-margin-left": "var(--wm-space-2)",
            "--wm-checkboxset-label-color": "var(--wm-color-on-surface-variant)",
            "root": {
                "width": "var(--wm-checkboxset-width)",
                "height": "var(--wm-checkboxset-height)",
                "backgroundColor": "var(--wm-checkboxset-background-color)",
                "borderColor": "var(--wm-checkboxset-border-color)",
                "borderWidth": "var(--wm-checkboxset-border-width)",
                "borderRadius": "var(--wm-checkboxset-border-radius)"
            },
            "icon": {
                "fontSize": "var(--wm-checkboxset-icon-size)",
                "color": "var(--wm-checkboxset-icon-color)"
            }
        },
        "selectedLabel": {
            "--wm-checkboxset-background-color": "var(--wm-color-primary)",
            "--wm-checkboxset-border-color": "var(--wm-color-primary)",
            "--wm-checkboxset-icon-color": "var(--wm-color-on-primary)",
            "--wm-checkboxset-label-font-size": "var(--wm-body-large-font-size)",
            "--wm-checkboxset-label-font-family": "var(--wm-body-large-font-family)",
            "--wm-checkboxset-label-font-margin-left": "var(--wm-space-2)",
            "--wm-checkboxset-label-color": "var(--wm-color-on-surface-variant)",
            "fontSize": "var(--wm-checkboxset-label-font-size)",
            "fontFamily": "var(--wm-checkbox-label-font-family)",
            "marginLeft": "var(--wm-checkboxset-label-margin-left)",
            "color": "var(--wm-checkboxset-label-color)"
        },
        "text": {
            "fontSize": "var(--wm-checkboxset-label-font-size)",
            "fontFamily": "var(--wm-checkbox-label-font-family)",
            "marginLeft": "var(--wm-checkboxset-label-margin-left)",
            "color": "var(--wm-checkboxset-label-color)"
        },
        "uncheckicon": {
            "root": {
                "width": "var(--wm-checkboxset-width)",
                "height": "var(--wm-checkboxset-height)",
                "backgroundColor": "var(--wm-checkboxset-background-color)",
                "borderColor": "var(--wm-checkboxset-border-color)",
                "borderWidth": "var(--wm-checkboxset-border-width)",
                "borderRadius": "var(--wm-checkboxset-border-radius)"
            },
            "icon": {
                "color": "var(--wm-checkboxset-icon-color)"
            }
        },
        "item": {
            "marginRight": "var(--wm-checkboxset-item-margin-right)",
            "marginLeft": "var(--wm-checkboxset-item-margin-left)",
            "marginTop": "var(--wm-checkboxset-item-margin-top)",
            "marginBottom": "var(--wm-checkboxset-item-margin-bottom)"
        }
    },
    "app-checkboxset-disabled": {
        "--wm-checkboxset-opacity": 0.6,
        "--wm-checkboxset-border-width": 2,
        "--wm-checkboxset-border-radius": "var(--wm-radius-xxs)",
        "--wm-checkboxset-border-color": "var(--wm-color-on-surface-variant)",
        "--wm-checkboxset-label-color": "var(--wm-color-on-surface-variant)",
        "root": {
            "borderColor": "var(--wm-checkboxset-border-color)",
            "opacity": "var(--wm-checkboxset-opacity)"
        }
    },
    "app-chips": {
        "activeChip": {
            "backgroundColor": "var(--wm-chips-background-color)",
            "borderColor": "var(--wm-chips-item-border-color)",
            "--wm-chips-color": "var(--wm-color-on-surface-variant)",
            "--wm-chips-background-color": "var(--wm-color-secondary-container)",
            "--wm-chips-item-border-color": "var(--wm-color-secondary-container)",
            "borderWidth": "var(--wm-chips-border-width)"
        },
        "activeChipLabel": {
            "color": "var(--wm-chips-color)",
            "--wm-chips-color": "var(--wm-color-on-surface-variant)",
            "--wm-chips-background-color": "var(--wm-color-secondary-container)",
            "--wm-chips-item-border-color": "var(--wm-color-secondary-container)"
        },
        "clearIcon": {
            "color": "#fff",
            "icon": {
                "fontSize": "var(--wm-chips-item-icon-size)",
                "paddingRight": "var(--wm-chips-item-icon-gap)",
                "color": "var(--wm-chips-item-icon-color)"
            }
        },
        "root": {
            "padding": "var(--wm-chips-list-padding)",
            "backgroundColor": "var(--wm-chips-list-background-color)",
            "borderWidth": "var(--wm-chips-list-border-width)",
            "borderStyle": "var(--wm-chips-list-border-style)",
            "borderColor": "var(--wm-chips-list-border-color)",
            "borderRadius": "var(--wm-chips-list-border-radius)",
            "minHeight": "var(--wm-chips-list-height)",
            "opacity": "var(--wm-chips-opacity)",
            "pointerEvents": "var(--wm-chips-pointer-events)"
        },
        "chipsWrapper": {
            "gap": "var(--wm-chips-list-gap)"
        },
        "chip": {
            "gap": "var(--wm-chips-item-gap)",
            "minHeight": "var(--wm-chips-item-height)",
            "height": "var(--wm-chips-item-height)",
            "padding": "var(--wm-chips-item-padding)",
            "backgroundColor": "var(--wm-chips-background-color)",
            "borderRadius": "var(--wm-chips-item-border-radius)",
            "borderWidth": "var(--wm-chips-border-width)",
            "borderStyle": "var(--wm-chips-item-border-style)",
            "borderColor": "var(--wm-chips-item-border-color)",
            "fontFamily": "var(--wm-chips-item-font-family)",
            "fontWeight": "var(--wm-chips-item-font-weight)",
            "fontSize": "var(--wm-chips-item-font-size)",
            "lineHeight": "var(--wm-chips-item-line-height)",
            "letterSpacing": "var(--wm-chips-item-letter-spacing)",
            "boxShadow": "var(--wm-chips-shadow)"
        },
        "assistchip": {
            "gap": "var(--wm-chips-item-gap)",
            "minHeight": "var(--wm-chips-item-height)",
            "height": "var(--wm-chips-item-height)",
            "padding": "var(--wm-chips-item-padding)",
            "color": "var(--wm-chips-color)",
            "backgroundColor": "var(--wm-chips-background-color)",
            "borderRadius": "var(--wm-chips-item-border-radius)",
            "borderWidth": "var(--wm-chips-border-width)",
            "borderStyle": "var(--wm-chips-item-border-style)",
            "borderColor": "var(--wm-chips-item-border-color)",
            "boxShadow": "var(--wm-chips-shadow)"
        },
        "chipLabel": {
            "color": "var(--wm-chips-color)",
            "fontFamily": "var(--wm-chips-item-font-family)",
            "fontWeight": "var(--wm-chips-item-font-weight)",
            "fontSize": "var(--wm-chips-item-font-size)",
            "lineHeight": "var(--wm-chips-item-line-height)",
            "letterSpacing": "var(--wm-chips-item-letter-spacing)"
        },
        "search": {
            "text": {
                "padding": "var(--wm-chips-input-padding)"
            },
            "placeholderText": {
                "color": "var(--wm-chips-list-place-holder-color)"
            }
        },
        "doneIcon": {
            "icon": {
                "fontSize": "var(--wm-chips-item-icon-size)",
                "paddingLeft": "var(--wm-chips-item-icon-gap)",
                "color": "var(--wm-chips-item-icon-color)"
            }
        },
        "imageStyles": {
            "root": {
                "width": "var(--wm-chips-item-avatar-size)",
                "height": "var(--wm-chips-item-avatar-size)",
                "borderRadius": "var(--wm-chips-item-avatar-radius)"
            }
        }
    },
    "app-chips-disabled": {
        "--wm-chips-opacity": 0.38,
        "--wm-chips-pointer-events": "none",
        "chip": {
            "opacity": "var(--wm-chips-opacity)",
            "pointerEvents": "var(--wm-chips-pointer-events)"
        }
    },
    "chips-filled-default": {
        "--wm-chips-border-width": 0,
        "--wm-chips-background-color": "var(--wm-color-surface)",
        "--wm-chips-color": "var(--wm-color-on-surface)"
    },
    "chips-filled-primary": {
        "--wm-chips-border-width": 0,
        "--wm-chips-background-color": "var(--wm-color-primary)",
        "--wm-chips-color": "var(--wm-color-on-primary)"
    },
    "chips-filled-secondary": {
        "--wm-chips-border-width": 0,
        "--wm-chips-background-color": "var(--wm-color-secondary)",
        "--wm-chips-color": "var(--wm-color-on-secondary)"
    },
    "chips-filled-tertiary": {
        "--wm-chips-border-width": 0,
        "--wm-chips-background-color": "var(--wm-color-tertiary)",
        "--wm-chips-color": "var(--wm-color-on-tertiary)"
    },
    "chips-elevated": {
        "--wm-chips-border-width": 0,
        "--wm-chips-shadow": "var(--wm-elevation-shadow-1)"
    },
    "app-composite": {
        "root": {
            "gap": "var(--wm-form-group-gap)"
        }
    },
    "app-radioset": {
        "text": {
            "color": "var(--wm-radiobutton-label-color)"
        },
        "groupHeaderTitle": {
            "backgroundColor": "var(--wm-radiobutton-title-background-color)",
            "color": "var(--wm-radiobutton-title-color)",
            "lineHeight": "var(--wm-radiobutton-title-line-height)",
            "padding": "var(--wm-radiobutton-title-padding)",
            "fontSize": "var(--wm-radiobutton-title-font-size)",
            "fontFamily": "var(--wm-radiobutton-title-font-family)"
        },
        "checkedRadio": {
            "--wm-radiobutton-label-color": "var(--wm-color-on-surface)",
            "--wm-radiobutton-color": "var(--wm-color-secondary)",
            "--wm-radiobutton-border-color": "var(--wm-color-secondary)",
            "root": {
                "borderStyle": "solid",
                "borderRadius": "50%",
                "minWidth": "var(--wm-radiobutton-size)",
                "width": "var(--wm-radiobutton-size)",
                "height": "var(--wm-radiobutton-size)",
                "color": "var(--wm-radiobutton-color)",
                "borderColor": "var(--wm-radiobutton-border-color)",
                "borderWidth": "var(--wm-radiobutton-border-width)"
            },
            "icon": {
                "paddingTop": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "paddingLeft": 0,
                "color": "var(--wm-radiobutton-color)",
                "fontSize": "var(--wm-radiobutton-indicator-size)"
            }
        },
        "selectedLabel": {
            "--wm-radiobutton-label-color": "var(--wm-color-on-surface)",
            "--wm-radiobutton-color": "var(--wm-color-secondary)",
            "--wm-radiobutton-border-color": "var(--wm-color-secondary)",
            "color": "var(--wm-radiobutton-label-color)"
        },
        "root": {
            "color": "var(--wm-radiobutton-color)"
        },
        "item": {
            "display": "flex",
            "flexDirection": "row",
            "alignContent": "center",
            "marginRight": "var(--wm-radiobutton-set-item-column-gap)",
            "marginTop": "var(--wm-radiobutton-set-item-row-gap)"
        },
        "radioLabel": {
            "alignSelf": "center",
            "fontSize": "var(--wm-radiobutton-label-font-size)",
            "fontFamily": "var(--wm-radiobutton-label-font-family)",
            "fontWeight": "var(--wm-radiobutton-label-font-weight)",
            "lineHeight": "var(--wm-radiobutton-label-line-height)",
            "letterSpacing": "var(--wm-radiobutton-label-letter-spacing)",
            "color": "var(--wm-radiobutton-label-color)",
            "marginLeft": "var(--wm-radiobutton-gap)"
        },
        "uncheckedRadio": {
            "root": {
                "borderRadius": "50%",
                "color": "var(--wm-radiobutton-color)",
                "borderColor": "var(--wm-radiobutton-border-color)",
                "borderWidth": "var(--wm-radiobutton-border-width)",
                "width": "var(--wm-radiobutton-size)",
                "height": "var(--wm-radiobutton-size)",
                "minWidth": "var(--wm-radiobutton-size)"
            }
        }
    },
    "app-radioset-disabled": {
        "--wm-radiobutton-opacity": 0.8,
        "--wm-radiobutton-label-color": "var(--wm-color-on-surface)",
        "--wm-radiobutton-border-color": "var(--wm-color-on-surface-variant)",
        "root": {
            "color": "var(--wm-radiobutton-color)",
            "opacity": "var(--wm-radiobutton-opacity)"
        }
    },
    "app-rating": {
        "text": {
            "color": "var(--wm-rating-text-color)",
            "padding": "var(--wm-rating-text-padding)",
            "fontSize": "var(--wm-rating-text-size)"
        },
        "icon": {
            "text": {
                "color": "var(--wm-rating-icon-color)",
                "fontSize": "var(--wm-rating-icon-size)",
                "width": "var(--wm-rating-icon-size)",
                "height": "var(--wm-rating-icon-size)",
                "minWidth": "var(--wm-rating-icon-size)",
                "lineHeight": "var(--wm-rating-icon-size)"
            }
        },
        "selectedIcon": {
            "text": {
                "color": "var(--wm-rating-icon-color)",
                "fontSize": "var(--wm-rating-icon-size)",
                "width": "var(--wm-rating-icon-size)",
                "height": "var(--wm-rating-icon-size)",
                "minWidth": "var(--wm-rating-icon-size)",
                "lineHeight": "var(--wm-rating-icon-size)",
                "--wm-rating-icon-size": 32,
                "--wm-rating-icon-color": "var(--wm-color-warning)"
            }
        },
        "root": {
            "padding": "var(--wm-rating-padding)",
            "gap": "var(--wm-space-3)",
            "opacity": "var(--wm-rating-opacity)"
        }
    },
    "app-rating-disabled": {
        "opacity": "var(--wm-rating-opacity)",
        "--wm-rating-opacity": 0.38
    },
    "app-slider": {
        "minimumTrack": {
            "backgroundColor": "var(--wm-slider-min-track-background)"
        },
        "maximumTrack": {
            "backgroundColor": "var(--wm-slider-max-track-background)"
        },
        "thumb": {
            "backgroundColor": "var(--wm-slider-thumb-background)",
            "color": "#4263eb",
            "marginLeft": 0,
            "height": "var(--wm-slider-thumb-height)",
            "width": "var(--wm-slider-thumb-width)",
            "borderRadius": "var(--wm-slider-thumb-border-radius)"
        },
        "root": {
            "width": "auto",
            "position": "relative"
        },
        "track": {
            "height": "var(--wm-slider-track-height)",
            "marginVertical": "var(--wm-slider-track-margin-vertical)",
            "borderRadius": "var(--wm-slider-track-border-radius)"
        },
        "tooltip": {
            "minWidth": "unset",
            "backgroundColor": "var(--wm-slider-tooltip-background)"
        },
        "tooltipLabel": {
            "color": "var(--wm-slider-tooltip-color)"
        },
        "tooltipTriangle": {
            "opacity": 0
        }
    },
    "app-switch": {
        "button": {
            "backgroundColor": "var(--wm-switch-button-background-color)",
            "borderColor": "var(--wm-switch-button-border-color)",
            "height": "var(--wm-switch-button-height)",
            "color": "var(--wm-switch-button-color)",
            "rippleColor": "var(--wm-switch-button-ripple-color)",
            "padding": "var(--wm-switch-button-padding)",
            "borderWidth": "var(--wm-switch-button-border-width)"
        },
        "selectedButton": {
            "color": "var(--wm-switch-button-color)",
            "backgroundColor": "var(--wm-switch-button-background-color)",
            "--wm-switch-button-text-transform": "capitalize",
            "--wm-switch-button-background-color": "var(--wm-color-secondary-fixed)",
            "--wm-switch-button-color": "var(--wm-color-on-secondary-container)",
            "--wm-switch-button-border-color": "var(--wm-color-outline)",
            "--wm-switch-button-font-size": "var(--wm-label-large-font-size)",
            "--wm-switch-button-font-family": "var(--wm-font-family-brand)",
            "--wm-switch-button-font-weight": "var(--wm-font-weight-500)",
            "borderColor": "var(--wm-switch-button-border-color)"
        },
        "selectedButtonText": {
            "--wm-switch-button-text-transform": "capitalize",
            "--wm-switch-button-background-color": "var(--wm-color-secondary-fixed)",
            "--wm-switch-button-color": "var(--wm-color-on-secondary-container)",
            "--wm-switch-button-border-color": "var(--wm-color-outline)",
            "--wm-switch-button-font-size": "var(--wm-label-large-font-size)",
            "--wm-switch-button-font-family": "var(--wm-font-family-brand)",
            "--wm-switch-button-font-weight": "var(--wm-font-weight-500)",
            "fontSize": "var(--wm-switch-button-font-size)",
            "fontFamily": "var(--wm-switch-button-font-family)",
            "fontWeight": "var(--wm-switch-button-font-weight)",
            "textTransform": "var(--wm-switch-button-text-transform)"
        },
        "firstButton": {
            "borderTopLeftRadius": "var(--wm-switch-button-border-radius)",
            "borderBottomLeftRadius": "var(--wm-switch-button-border-radius)"
        },
        "lastButton": {
            "borderTopRightRadius": "var(--wm-switch-button-border-radius)",
            "borderBottomRightRadius": "var(--wm-switch-button-border-radius)"
        },
        "text": {
            "fontSize": "var(--wm-switch-button-font-size)",
            "fontFamily": "var(--wm-switch-button-font-family)",
            "fontWeight": "var(--wm-switch-button-font-weight)",
            "textTransform": "var(--wm-switch-button-text-transform)"
        }
    },
    "app-switch-disabled": {
        "--wm-switch-opacity": 0.6,
        "opacity": "var(--wm-switch-opacity)"
    },
    "app-invalid": {
        "focused": {
            "borderColor": "#4263eb"
        }
    },
    "app-toggle-on": {
        "backgroundColor": "#4263eb",
        "--wm-toggle-border-radius": 18,
        "--wm-toggle-border-width": 2,
        "--wm-toggle-handle-width": 16,
        "--wm-toggle-handle-height": 16,
        "--wm-toggle-handle-radius": 18,
        "--wm-toggle-handle-margin-left": 8,
        "--wm-toggle-handle-margin-right": 1,
        "--wm-toggle-background-color": "var(--wm-color-secondary)",
        "--wm-toggle-border-color": "var(--wm-color-secondary)",
        "--wm-toggle-handle-color": "var(--wm-color-on-secondary)",
        "root": {
            "width": "var(--wm-toggle-width)",
            "height": "var(--wm-toggle-height)",
            "borderRadius": "var(--wm-toggle-border-radius)",
            "borderColor": "var(--wm-toggle-border-color)",
            "backgroundColor": "var(--wm-toggle-background-color)",
            "borderWidth": "var(--wm-toggle-border-width)"
        },
        "handle": {
            "width": "var(--wm-toggle-handle-width)",
            "height": "var(--wm-toggle-handle-height)",
            "borderRadius": "var(--wm-toggle-handle-radius)",
            "marginLeft": "var(--wm-toggle-handle-margin-left)",
            "marginRight": "var(--wm-toggle-handle-margin-right)",
            "backgroundColor": "var(--wm-toggle-handle-color)"
        }
    },
    "app-toggle-off": {
        "backgroundColor": "#aaa",
        "root": {
            "width": "var(--wm-toggle-width)",
            "height": "var(--wm-toggle-height)",
            "borderRadius": "var(--wm-toggle-border-radius)",
            "borderColor": "var(--wm-toggle-border-color)",
            "backgroundColor": "var(--wm-toggle-background-color)",
            "borderWidth": "var(--wm-toggle-border-width)"
        },
        "handle": {
            "width": "var(--wm-toggle-handle-width)",
            "height": "var(--wm-toggle-handle-height)",
            "borderRadius": "var(--wm-toggle-handle-radius)",
            "marginLeft": "var(--wm-toggle-handle-margin-left)",
            "marginRight": "var(--wm-toggle-handle-margin-right)",
            "backgroundColor": "var(--wm-toggle-handle-color)"
        }
    },
    "app-toggle": {
        "text": {
            "color": "#4263eb"
        },
        "handle": {
            "color": "#4263eb"
        }
    },
    "app-toggle-disabled": {
        "--wm-toggle-opacity": 0.5,
        "opacity": "var(--wm-toggle-opacity)",
        "handle": {
            "opacity": "var(--wm-toggle-opacity)"
        }
    },
    "app-appnavbar": {
        "root": {
            "backgroundColor": "var(--wm-navbar-background-color)",
            "height": "var(--wm-navbar-height)",
            "padding": "var(--wm-navbar-padding)",
            "borderWidth": "var(--wm-navbar-border-width)",
            "borderStyle": "var(--wm-navbar-border-style)",
            "borderColor": "var(--wm-navbar-border-color)",
            "borderRadius": "var(--wm-navbar-border-radius)"
        },
        "leftnavIcon": {
            "root": {
                "fontSize": 24,
                "color": "#151420"
            },
            "color": "var(--wm-navbar-left-icon-color)",
            "fontSize": "var(--wm-navbar-left-icon-size)",
            "icon": {
                "color": "var(--wm-navbar-left-icon-color)",
                "fontSize": "var(--wm-navbar-left-icon-size)"
            }
        },
        "backIcon": {
            "root": {
                "fontSize": 24,
                "color": "#151420"
            },
            "color": "var(--wm-navbar-back-icon-color)",
            "fontSize": "var(--wm-navbar-back-icon-size)",
            "icon": {
                "color": "var(--wm-navbar-back-icon-color)",
                "fontSize": "var(--wm-navbar-back-icon-size)"
            }
        },
        "image": {
            "width": 32,
            "height": 32,
            "root": {
                "width": "var(--wm-navbar-image-width)",
                "height": "var(--wm-navbar-image-height)"
            }
        },
        "content": {
            "color": "var(--wm-navbar-content-color)",
            "fontSize": "var(--wm-navbar-content-font-size)",
            "fontWeight": "var(--wm-navbar-content-font-weight)",
            "fontFamily": "var(--wm-navbar-content-font-family)"
        },
        "badge": {
            "backgroundColor": "var(--wm-navbar-badge-background-color)",
            "color": "var(--wm-navbar-badge-color)",
            "height": "var(--wm-navbar-badge-height)",
            "width": "var(--wm-navbar-badge-width)",
            "fontSize": "var(--wm-navbar-badge-font-size)",
            "lineHeight": "var(--wm-navbar-badge-line-height)",
            "borderRadius": "var(--wm-navbar-badge-border-radius)",
            "marginLeft": "var(--wm-navbar-badge-margin-left)"
        }
    },
    "navbarAnchorItem": {
        "text": {
            "color": "var(--wm-navbar-anchor-text-color)",
            "fontSize": "var(--wm-navbar-anchor-text-font-size)",
            "fontWeight": "var(--wm-navbar-anchor-text-font-weight)",
            "fontFamily": "var(--wm-navbar-anchor-text-font-family)"
        },
        "icon": {
            "text": {
                "color": "var(--wm-navbar-anchor-icon-color)",
                "fontSize": "var(--wm-navbar-anchor-icon-size)"
            },
            "icon": {
                "color": "var(--wm-navbar-anchor-icon-color)",
                "fontSize": "var(--wm-navbar-anchor-icon-size)"
            }
        },
        "badge": {
            "backgroundColor": "var(--wm-navbar-badge-background-color)",
            "color": "var(--wm-navbar-badge-color)",
            "height": "var(--wm-navbar-badge-height)",
            "width": "var(--wm-navbar-badge-width)",
            "fontSize": "var(--wm-navbar-badge-font-size)",
            "lineHeight": "var(--wm-navbar-badge-line-height)",
            "borderRadius": "var(--wm-navbar-badge-border-radius)",
            "marginLeft": "var(--wm-navbar-badge-margin-left)"
        },
        "root": {
            "padding": "var(--wm-navbar-anchor-padding)"
        }
    },
    "navbarButton": {
        "icon": {
            "text": {
                "color": "var(--wm-navbar-button-color)",
                "fontSize": "var(--wm-navbar-button-font-size)"
            }
        },
        "text": {
            "color": "var(--wm-navbar-button-color)",
            "fontSize": "var(--wm-navbar-button-font-size)",
            "fontWeight": "var(--wm-navbar-button-font-weight)",
            "fontFamily": "var(--wm-navbar-button-font-family)"
        }
    },
    "navbarMenu": {
        "link": {
            "backgroundColor": "transparent",
            "icon": {
                "root": {
                    "fontSize": 24,
                    "color": "#151420"
                },
                "icon": {
                    "color": "var(--wm-navbar-menu-icon-color)",
                    "fontSize": "var(--wm-navbar-menu-icon-size)"
                }
            },
            "text": {
                "fontSize": "var(--wm-navbar-menu-icon-size)",
                "color": "var(--wm-navbar-menu-icon-color)"
            }
        }
    },
    "navbarPopover": {
        "link": {
            "icon": {
                "root": {
                    "fontSize": 24,
                    "color": "#151420"
                },
                "icon": {
                    "color": "var(--wm-navbar-popover-icon-color)",
                    "fontSize": "var(--wm-navbar-popover-icon-size)"
                }
            },
            "text": {
                "fontSize": "var(--wm-navbar-popover-icon-size)",
                "color": "var(--wm-navbar-popover-icon-color)"
            }
        }
    },
    "app-menu": {
        "root": {
            "backgroundColor": "var(--wm-dropdown-menu-background)",
            "borderRadius": "var(--wm-dropdown-menu-border-radius)",
            "borderWidth": "var(--wm-dropdown-menu-border-width)",
            "borderColor": "var(--wm-dropdown-menu-border-color)"
        },
        "link": {
            "icon": {
                "root": {
                    "color": "var(--wm-dropdown-menu-color)"
                },
                "icon": {
                    "fontSize": "var(--wm-dropdown-menu-caret-size)",
                    "color": "var(--wm-dropdown-menu-caret-color)"
                }
            },
            "lefticon": {
                "root": {
                    "color": "#666"
                }
            },
            "text": {
                "color": "var(--wm-dropdown-menu-color)",
                "fontWeight": "var(--wm-dropdown-menu-text-font-weight)",
                "textDecoration": "var(--wm-dropdown-menu-text-decoration)",
                "padding": "var(--wm-dropdown-menu-text-padding)"
            }
        },
        "menu": {
            "backgroundColor": "var(--wm-dropdown-menu-content-background)",
            "borderRadius": "var(--wm-dropdown-menu-content-border-radius)",
            "width": "var(--wm-dropdown-menu-content-width)",
            "padding": "var(--wm-dropdown-menu-padding)"
        },
        "menuItem": {
            "root": {
                "borderBottomColor": "#ccc",
                "borderStyle": "var(--wm-dropdown-menu-item-border-style)",
                "padding": "var(--wm-dropdown-menu-item-padding)"
            },
            "icon": {
                "icon": {
                    "color": "#666"
                }
            },
            "lefticon": {
                "icon": {
                    "color": "#666"
                }
            },
            "text": {
                "color": "var(--wm-dropdown-menu-item-color)",
                "paddingTop": 0,
                "paddingLeft": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "textDecorationLine": "none",
                "fontFamily": "var(--wm-dropdown-menu-item-font-family)",
                "fontSize": "var(--wm-dropdown-menu-item-font-size)",
                "fontWeight": "var(--wm-dropdown-menu-item-font-weight)",
                "lineHeight": "var(--wm-dropdown-menu-item-line-height)"
            }
        }
    },
    "app-popover": {
        "modalContent": {
            "boxShadow": "var(--wm-dropdown-menu-box-shadow)"
        },
        "popover": {
            "backgroundColor": "var(--wm-popover-background-color)",
            "padding": "var(--wm-popover-padding)",
            "borderRadius": "var(--wm-popover-border-radius)",
            "borderWidth": "var(--wm-popover-border-width)",
            "borderStyle": "var(--wm-popover-border-style)",
            "borderColor": "var(--wm-popover-border-color)"
        },
        "title": {
            "backgroundColor": "var(--wm-popover-header-background-color)",
            "color": "var(--wm-popover-header-color)",
            "padding": "var(--wm-popover-header-padding)",
            "fontFamily": "var(--wm-popover-header-font-family)",
            "fontSize": "var(--wm-popover-header-font-size)",
            "fontWeight": "var(--wm-popover-header-font-weight)",
            "lineHeight": "var(--wm-popover-header-line-height)",
            "letterSpacing": "var(--wm-popover-header-letter-spacing)"
        },
        "popoverContent": {
            "root": {
                "backgroundColor": "var(--wm-popover-content-background-color)",
                "boxShadow": "var(--wm-popover-content-shadow)",
                "borderWidth": "var(--wm-popover-content-border-width)",
                "borderStyle": "var(--wm-popover-content-border-style)",
                "borderColor": "var(--wm-popover-content-border-color)",
                "borderRadius": "var(--wm-popover-content-border-radius)"
            }
        },
        "root": {
            "backgroundColor": "var(--wm-popover-link-background-color)",
            "borderColor": "var(--wm-popover-link-border-color)",
            "borderWidth": "var(--wm-popover-link-border-width)",
            "borderStyle": "var(--wm-popover-link-border-style)",
            "borderRadius": "var(--wm-popover-link-border-radius)",
            "padding": "var(--wm-popover-link-padding)",
            "width": "var(--wm-popover-link-width)",
            "height": "var(--wm-popover-link-height)",
            "minHeight": "var(--wm-popover-link-min-height)"
        },
        "link": {
            "icon": {
                "root": {
                    "minWidth": "var(--wm-popover-link-icon-size)",
                    "width": "var(--wm-popover-link-icon-size)",
                    "height": "var(--wm-popover-link-icon-size)"
                },
                "icon": {
                    "color": "var(--wm-popover-link-icon-color)",
                    "fontSize": "var(--wm-popover-link-icon-size)",
                    "minWidth": "var(--wm-popover-link-icon-size)",
                    "width": "var(--wm-popover-link-icon-size)",
                    "height": "var(--wm-popover-link-icon-size)",
                    "lineHeight": "var(--wm-popover-link-icon-size)"
                }
            },
            "text": {
                "color": "var(--wm-popover-link-color)",
                "paddingLeft": "var(--wm-space-2)",
                "paddingRight": "var(--wm-space-2)",
                "fontSize": "var(--wm-popover-link-font-size)",
                "fontFamily": "var(--wm-popover-link-font-family)",
                "fontWeight": "var(--wm-popover-link-font-weight)",
                "lineHeight": "var(--wm-popover-link-line-height)",
                "letterSpacing": "var(--wm-popover-link-letter-spacing)",
                "textDecoration": "var(--wm-popover-link-text-decoration)",
                "textDecorationLine": "var(--wm-popover-link-text-decoration)"
            }
        }
    },
    "app-navitem": {
        "root": {
            "borderColor": "#ccc",
            "backgroundColor": "var(--wm-navitem-background)"
        },
        "caretIcon": {
            "text": {
                "color": "var(--wm-navitem-caret-color)"
            }
        },
        "navAnchorItem": {
            "icon": {
                "icon": {
                    "color": "var(--wm-navitem-icon-color)",
                    "fontSize": "var(--wm-navitem-icon-size)",
                    "paddingLeft": "var(--wm-navitem-icon-padding-left)",
                    "paddingRight": "var(--wm-navitem-icon-padding-right)",
                    "paddingTop": "var(--wm-navitem-icon-padding-top)",
                    "paddingBottom": "var(--wm-navitem-icon-padding-bottom)"
                }
            },
            "paddingTop": "var(--wm-navitem-padding-top)",
            "paddingBottom": "var(--wm-navitem-padding-bottom)",
            "paddingLeft": "var(--wm-navitem-padding-left)",
            "paddingRight": "var(--wm-navitem-padding-right)",
            "marginLeft": "var(--wm-navitem-margin-left)",
            "marginRight": "var(--wm-navitem-margin-right)",
            "marginTop": "var(--wm-navitem-margin-top)",
            "marginBottom": "var(--wm-navitem-margin-bottom)",
            "borderRadius": "var(--wm-navitem-border-radius)",
            "backgroundColor": "var(--wm-navitem-background)",
            "badge": {
                "marginTop": "var(--wm-navitem-badge-margin-top)",
                "marginBottom": "var(--wm-navitem-badge-margin-bottom)",
                "marginRight": "var(--wm-navitem-badge-margin-right)",
                "marginLeft": "var(--wm-navitem-badge-margin-left)",
                "backgroundColor": "var(--wm-navitem-badge-background)",
                "textAlign": "var(--wm-navitem-badge-text-align)",
                "alignSelf": "var(--wm-navitem-badge-align-self)",
                "fontWeight": "var(--wm-navitem-badge-font-weight)",
                "fontSize": "var(--wm-navitem-badge-font-size)",
                "fontFamily": "var(--wm-navitem-badge-font-family)",
                "borderRadius": "var(--wm-navitem-badge-border-radius)",
                "minWidth": "var(--wm-navitem-badge-min-width)",
                "minHeight": "var(--wm-navitem-badge-min-height)",
                "lineHeight": "var(--wm-navitem-badge-line-height)",
                "color": "var(--wm-navitem-badge-color)"
            },
            "text": {
                "textDecoration": "var(--wm-navitem-text-decoration)",
                "textDecorationLine": "var(--wm-navitem-text-decoration)",
                "lineHeight": "var(--wm-navitem-line-height)",
                "fontWeight": "var(--wm-navitem-font-weight)",
                "fontSize": "var(--wm-navitem-font-size)",
                "fontFamily": "var(--wm-navitem-font-family)",
                "paddingLeft": "var(--wm-navitem-text-padding-left)",
                "paddingRight": "var(--wm-navitem-text-padding-right)",
                "paddingTop": "var(--wm-navitem-text-padding-top)",
                "paddingBottom": "var(--wm-navitem-text-padding-bottom)",
                "color": "var(--wm-navitem-color)",
                "flex": "var(--wm-navitem-text-flex)"
            }
        }
    },
    "app-navitem-active": {
        "root": {
            "backgroundColor": "var(--wm-navitem-background)",
            "paddingTop": "var(--wm-navitem-padding-top)",
            "paddingBottom": "var(--wm-navitem-padding-bottom)",
            "paddingLeft": "var(--wm-navitem-padding-left)",
            "paddingRight": "var(--wm-navitem-padding-right)",
            "marginLeft": "var(--wm-navitem-margin-left)",
            "marginRight": "var(--wm-navitem-margin-right)",
            "marginTop": "var(--wm-navitem-margin-top)",
            "marginBottom": "var(--wm-navitem-margin-bottom)",
            "borderRadius": "var(--wm-navitem-border-radius)"
        },
        "navAnchorItem": {
            "root": {
                "backgroundColor": "var(--wm-navitem-background)",
                "paddingTop": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "paddingLeft": 0
            },
            "text": {
                "color": "var(--wm-navitem-color)",
                "textDecoration": "var(--wm-navitem-text-decoration)",
                "textDecorationLine": "var(--wm-navitem-text-decoration)",
                "lineHeight": "var(--wm-navitem-line-height)",
                "fontWeight": "var(--wm-navitem-font-weight)",
                "fontSize": "var(--wm-navitem-font-size)",
                "fontFamily": "var(--wm-navitem-font-family)",
                "paddingLeft": "var(--wm-navitem-text-padding-left)",
                "paddingRight": "var(--wm-navitem-text-padding-right)",
                "paddingTop": "var(--wm-navitem-text-padding-top)",
                "paddingBottom": "var(--wm-navitem-text-padding-bottom)",
                "flex": "var(--wm-navitem-text-flex)"
            },
            "icon": {
                "icon": {
                    "color": "var(--wm-navitem-icon-color)",
                    "fontSize": "var(--wm-navitem-icon-size)",
                    "paddingLeft": "var(--wm-navitem-icon-padding-left)",
                    "paddingRight": "var(--wm-navitem-icon-padding-right)",
                    "paddingTop": "var(--wm-navitem-icon-padding-top)",
                    "paddingBottom": "var(--wm-navitem-icon-padding-bottom)"
                }
            },
            "--wm-navitem-color": "var(--wm-color-on-secondary-fixed)",
            "--wm-navitem-icon-size": "var(--wm-icon-size)",
            "--wm-navitem-icon-color": "var(--wm-color-on-secondary-container)",
            "--wm-navitem-border-radius": "var(--wm-radius-pill)",
            "--wm-navitem-background": "var(--wm-color-secondary-fixed)",
            "--wm-navitem-badge-font-size": "var(--wm-label-large-font-size)",
            "--wm-navitem-badge-font-family": "var(--wm-label-large-font-family)",
            "--wm-navitem-badge-font-weight": "var(--wm-font-weight-600)",
            "--wm-navitem-badge-border-radius": "var(--wm-radius-circle)",
            "--wm-navitem-badge-background": "var(--wm-color-secondary-fixed-dim)",
            "--wm-navitem-caret-color": "var(--wm-color-on-secondary-fixed)",
            "badge": {
                "marginTop": "var(--wm-navitem-badge-margin-top)",
                "marginBottom": "var(--wm-navitem-badge-margin-bottom)",
                "marginRight": "var(--wm-navitem-badge-margin-right)",
                "marginLeft": "var(--wm-navitem-badge-margin-left)",
                "backgroundColor": "var(--wm-navitem-badge-background)",
                "textAlign": "var(--wm-navitem-badge-text-align)",
                "alignSelf": "var(--wm-navitem-badge-align-self)",
                "fontWeight": "var(--wm-navitem-badge-font-weight)",
                "fontSize": "var(--wm-navitem-badge-font-size)",
                "fontFamily": "var(--wm-navitem-badge-font-family)",
                "borderRadius": "var(--wm-navitem-badge-border-radius)",
                "minWidth": "var(--wm-navitem-badge-min-width)",
                "minHeight": "var(--wm-navitem-badge-min-height)",
                "lineHeight": "var(--wm-navitem-badge-line-height)",
                "color": "var(--wm-navitem-badge-color)"
            }
        },
        "--wm-navitem-color": "var(--wm-color-on-secondary-fixed)",
        "--wm-navitem-icon-size": "var(--wm-icon-size)",
        "--wm-navitem-icon-color": "var(--wm-color-on-secondary-container)",
        "--wm-navitem-border-radius": "var(--wm-radius-pill)",
        "--wm-navitem-background": "var(--wm-color-secondary-fixed)",
        "--wm-navitem-badge-font-size": "var(--wm-label-large-font-size)",
        "--wm-navitem-badge-font-family": "var(--wm-label-large-font-family)",
        "--wm-navitem-badge-font-weight": "var(--wm-font-weight-600)",
        "--wm-navitem-badge-border-radius": "var(--wm-radius-circle)",
        "--wm-navitem-badge-background": "var(--wm-color-secondary-fixed-dim)",
        "--wm-navitem-caret-color": "var(--wm-color-on-secondary-fixed)",
        "caretIcon": {
            "text": {
                "color": "var(--wm-navitem-caret-color)"
            }
        },
        "backgroundColor": "var(--wm-navitem-background)"
    },
    "app-navitem-child": {
        "root": {
            "backgroundColor": "var(--wm-navitem-child-background-color)"
        },
        "navAnchorItem": {
            "text": {
                "color": "var(--wm-navitem-child-color)"
            },
            "icon": {
                "icon": {
                    "color": "var(--wm-navitem-child-color)"
                }
            },
            "badge": {
                "color": "var(--wm-navitem-child-color)"
            }
        }
    },
    "navAnchorItem": {
        "icon": {
            "icon": {
                "color": "var(--wm-navitem-icon-color)",
                "fontSize": "var(--wm-navitem-icon-size)",
                "paddingLeft": "var(--wm-navitem-icon-padding-left)",
                "paddingRight": "var(--wm-navitem-icon-padding-right)",
                "paddingTop": "var(--wm-navitem-icon-padding-top)",
                "paddingBottom": "var(--wm-navitem-icon-padding-bottom)"
            }
        },
        "paddingTop": "var(--wm-navitem-padding-top)",
        "paddingBottom": "var(--wm-navitem-padding-bottom)",
        "paddingLeft": "var(--wm-navitem-padding-left)",
        "paddingRight": "var(--wm-navitem-padding-right)",
        "marginLeft": "var(--wm-navitem-margin-left)",
        "marginRight": "var(--wm-navitem-margin-right)",
        "marginTop": "var(--wm-navitem-margin-top)",
        "marginBottom": "var(--wm-navitem-margin-bottom)",
        "borderRadius": "var(--wm-navitem-border-radius)",
        "backgroundColor": "var(--wm-navitem-background)",
        "badge": {
            "marginTop": "var(--wm-navitem-badge-margin-top)",
            "marginBottom": "var(--wm-navitem-badge-margin-bottom)",
            "marginRight": "var(--wm-navitem-badge-margin-right)",
            "marginLeft": "var(--wm-navitem-badge-margin-left)",
            "backgroundColor": "var(--wm-navitem-badge-background)",
            "textAlign": "var(--wm-navitem-badge-text-align)",
            "alignSelf": "var(--wm-navitem-badge-align-self)",
            "fontWeight": "var(--wm-navitem-badge-font-weight)",
            "fontSize": "var(--wm-navitem-badge-font-size)",
            "fontFamily": "var(--wm-navitem-badge-font-family)",
            "borderRadius": "var(--wm-navitem-badge-border-radius)",
            "minWidth": "var(--wm-navitem-badge-min-width)",
            "minHeight": "var(--wm-navitem-badge-min-height)",
            "lineHeight": "var(--wm-navitem-badge-line-height)",
            "color": "var(--wm-navitem-badge-color)"
        },
        "text": {
            "textDecoration": "var(--wm-navitem-text-decoration)",
            "textDecorationLine": "var(--wm-navitem-text-decoration)",
            "lineHeight": "var(--wm-navitem-line-height)",
            "fontWeight": "var(--wm-navitem-font-weight)",
            "fontSize": "var(--wm-navitem-font-size)",
            "fontFamily": "var(--wm-navitem-font-family)",
            "paddingLeft": "var(--wm-navitem-text-padding-left)",
            "paddingRight": "var(--wm-navitem-text-padding-right)",
            "paddingTop": "var(--wm-navitem-text-padding-top)",
            "paddingBottom": "var(--wm-navitem-text-padding-bottom)",
            "color": "var(--wm-navitem-color)",
            "flex": "var(--wm-navitem-text-flex)"
        }
    },
    "app-popover-action-sheet": {
        "popover": {
            "left": "var(--wm-popover-left)",
            "bottom": "var(--wm-popover-bottom)",
            "width": "var(--wm-popover-width)",
            "minHeight": "var(--wm-popover-min-height)",
            "boxShadow": "var(--wm-popover-shadow)"
        }
    },
    "app-left-panel": {
        "root": {
            "backgroundColor": "var(--wm-left-panel-background)",
            "boxShadow": "var(--wm-left-panel-elevation)",
            "borderTopRightRadius": "var(--wm-left-panel-border-top-right-radius)",
            "borderBottomRightRadius": "var(--wm-left-panel-border-bottom-right-radius)",
            "maxWidth": "var(--wm-left-panel-max-width)"
        }
    },
    "app-page-content": {
        "root": {
            "backgroundColor": "var(--wm-page-content-background)",
            "padding": "var(--wm-page-content-padding)"
        }
    },
    "app-partial-container": {
        "root": {
            "backgroundColor": "var(--wm-partial-container-background-color)"
        }
    },
    "app-tabbar": {
        "menu": {
            "backgroundColor": "var(--wm-tabbar-menu-background)",
            "alignItems": "center",
            "height": "var(--wm-tabbar-menu-height)"
        },
        "moreMenu": {
            "backgroundColor": "var(--wm-tabbar-more-menu-background)",
            "width": "var(--wm-tabbar-more-menu-width)",
            "boxShadow": "var(--wm-tabbar-more-menu-box-shadow)"
        },
        "tabIcon": {
            "icon": {
                "color": "var(--wm-tabbar-icon-color)",
                "borderBottomColor": "#4263eb",
                "fontSize": "var(--wm-tabbar-icon-size)",
                "padding": "var(--wm-tabbar-icon-padding)"
            },
            "root": {
                "borderBottomColor": "var(--wm-tabbar-icon-border-bottom-color)",
                "padding": "var(--wm-tabbar-icon-padding)"
            }
        },
        "tabLabel": {
            "color": "var(--wm-tabbar-text-color)",
            "fontSize": "var(--wm-tabbar-text-font-size)",
            "fontFamily": "var(--wm-tabbar-text-font-family)",
            "fontWeight": "var(--wm-tabbar-text-font-weight)",
            "marginTop": "var(--wm-tabbar-text-margin-top)"
        },
        "root": {
            "overflow": "hidden",
            "height": "var(--wm-tabbar-height)",
            "gap": "var(--wm-tabbar-gap)",
            "boxShadow": "var(--wm-tabbar-box-shadow)",
            "borderRadius": "var(--wm-tabbar-border-radius)",
            "borderWidth": "var(--wm-tabbar-border-width)",
            "borderStyle": "var(--wm-tabbar-border-style)",
            "borderColor": "var(--wm-tabbar-border-color)"
        },
        "moreMenuRow": {
            "width": "var(--wm-tabbar-more-menu-row-width)",
            "padding": "var(--wm-tabbar-more-menu-row-padding)"
        },
        "tabItem": {
            "display": "flex",
            "justifyContent": "center",
            "alignItems": "center",
            "minHeight": "var(--wm-tabbar-item-min-height)",
            "minWidth": "var(--wm-tabbar-item-min-width)",
            "backgroundColor": "var(--wm-tabbar-item-background-color)",
            "borderRadius": "var(--wm-tabbar-item-border-radius)",
            "borderWidth": "var(--wm-tabbar-item-border-width)",
            "marginBottom": "var(--wm-space-0)",
            "borderColor": "var(--wm-tabbar-item-border-color)",
            "borderStyle": "var(--wm-tabbar-item-border-style)",
            "opacity": "var(--wm-tabbar-item-opacity)",
            "padding": "var(--wm-tabbar-item-padding)",
            "gap": "var(--wm-tabbar-item-gap)"
        },
        "activeTabItem": {
            "display": "flex",
            "justifyContent": "center",
            "alignItems": "center",
            "height": "auto",
            "opacity": "var(--wm-tabbar-item-opacity)",
            "marginBottom": "var(--wm-space-0)",
            "borderRadius": "var(--wm-tabbar-item-border-radius)",
            "borderWidth": "var(--wm-tabbar-item-border-width)",
            "borderColor": "var(--wm-tabbar-item-border-color)",
            "borderStyle": "var(--wm-tabbar-item-border-style)",
            "backgroundColor": "var(--wm-tabbar-item-background-color)",
            "padding": "var(--wm-tabbar-item-padding)",
            "gap": "var(--wm-tabbar-item-gap)",
            "--wm-tabbar-item-border-radius": 50,
            "--wm-tabbar-item-border-color": "transparent",
            "--wm-tabbar-item-margin-bottom": -2,
            "--wm-tabbar-item-border-width": "var(--wm-border-width-0)",
            "--wm-tabbar-item-border-style": "var(--wm-border-style-solid)",
            "--wm-tabbar-item-background-color": "var(--wm-color-primary-container)",
            "--wm-tabbar-item-padding": "var(--wm-space-0)",
            "--wm-tabbar-item-gap": "var(--wm-space-0)",
            "--wm-tabbar-icon-color": "var(--wm-color-primary)",
            "--wm-tabbar-icon-padding": "var(--wm-space-0)",
            "--wm-tabbar-text-font-weight": "var(--wm-font-weight-700)",
            "--wm-tabbar-text-color": "var(--wm-color-on-surface-variant)"
        },
        "activeTabIcon": {
            "icon": {
                "color": "var(--wm-tabbar-icon-color)",
                "fontSize": "var(--wm-tabbar-icon-size)",
                "padding": "var(--wm-tabbar-icon-padding)"
            },
            "--wm-tabbar-item-border-radius": 50,
            "--wm-tabbar-item-border-color": "transparent",
            "--wm-tabbar-item-margin-bottom": -2,
            "--wm-tabbar-item-border-width": "var(--wm-border-width-0)",
            "--wm-tabbar-item-border-style": "var(--wm-border-style-solid)",
            "--wm-tabbar-item-background-color": "var(--wm-color-primary-container)",
            "--wm-tabbar-item-padding": "var(--wm-space-0)",
            "--wm-tabbar-item-gap": "var(--wm-space-0)",
            "--wm-tabbar-icon-color": "var(--wm-color-primary)",
            "--wm-tabbar-icon-padding": "var(--wm-space-0)",
            "--wm-tabbar-text-font-weight": "var(--wm-font-weight-700)",
            "--wm-tabbar-text-color": "var(--wm-color-on-surface-variant)"
        },
        "activeTabLabel": {
            "fontWeight": "var(--wm-tabbar-text-font-weight)",
            "fontSize": "var(--wm-tabbar-text-font-size)",
            "fontFamily": "var(--wm-tabbar-text-font-family)",
            "color": "var(--wm-tabbar-text-color)",
            "--wm-tabbar-item-border-radius": 50,
            "--wm-tabbar-item-border-color": "transparent",
            "--wm-tabbar-item-margin-bottom": -2,
            "--wm-tabbar-item-border-width": "var(--wm-border-width-0)",
            "--wm-tabbar-item-border-style": "var(--wm-border-style-solid)",
            "--wm-tabbar-item-background-color": "var(--wm-color-primary-container)",
            "--wm-tabbar-item-padding": "var(--wm-space-0)",
            "--wm-tabbar-item-gap": "var(--wm-space-0)",
            "--wm-tabbar-icon-color": "var(--wm-color-primary)",
            "--wm-tabbar-icon-padding": "var(--wm-space-0)",
            "--wm-tabbar-text-font-weight": "var(--wm-font-weight-700)",
            "--wm-tabbar-text-color": "var(--wm-color-on-surface-variant)"
        }
    },
    "app-page": {
        "root": {
            "backgroundColor": "var(--wm-page-background)"
        }
    },
    "app-fileupload": {
        "root": {
            "backgroundColor": "var(--wm-fileupload-background)",
            "color": "#151420",
            "borderColor": "var(--wm-fileupload-border-color)",
            "borderStyle": "var(--wm-fileupload-border-style)",
            "borderWidth": "var(--wm-fileupload-border-width)",
            "borderRadius": "var(--wm-fileupload-border-radius)"
        },
        "button": {
            "text": {
                "color": "var(--wm-fileupload-text-color)",
                "fontSize": "var(--wm-fileupload-text-font-size)",
                "fontWeight": "var(--wm-fileupload-text-font-weight)",
                "textAlign": "var(--wm-fileupload-text-align)"
            },
            "color": "#151420",
            "icon": {
                "icon": {
                    "color": "var(--wm-fileupload-icon-color)",
                    "fontSize": "var(--wm-fileupload-icon-font-size)"
                }
            },
            "root": {
                "borderColor": "transparent",
                "borderWidth": 0,
                "backgroundColor": "transparent",
                "rippleColor": "var(--wm-fileupload-ripple-color)"
            }
        }
    },
    "app-video": {
        "root": {
            "height": "var(--wm-video-height)",
            "width": "var(--wm-video-width)"
        }
    },
    "app-lottie": {
        "root": {
            "backgroundColor": "var(--wm-lottie-background-color)",
            "padding": "var(--wm-lottie-padding)"
        },
        "content": {
            "height": "var(--wm-lottie-content-height)",
            "width": "var(--wm-lottie-content-width)",
            "backgroundColor": "var(--wm-lottie-content-background-color)"
        }
    },
    "app-audio": {
        "root": {
            "width": "var(--wm-audio-width)"
        }
    },
    "app-bottomsheet": {
        "backdrop": {
            "backgroundColor": "var(--wm-bottomsheet-backdrop-background)"
        },
        "container": {
            "width": "var(--wm-bottomsheet-width)",
            "backgroundColor": "var(--wm-bottomsheet-background)",
            "borderTopRightRadius": "var(--wm-bottomsheet-border-radius)",
            "borderTopLeftRadius": "var(--wm-bottomsheet-border-radius)",
            "margin": "var(--wm-bottomsheet-margin)",
            "borderWidth": "var(--wm-bottomsheet-border-width)",
            "borderColor": "var(--wm-bottomsheet-border-color)",
            "borderStyle": "var(--wm-bottomsheet-border-style)"
        },
        "dragHandleContainer": {
            "padding": "var(--wm-bottomsheet-handle-padding)",
            "borderBottomWidth": "var(--wm-bottomsheet-handle-border-width)",
            "borderBottomColor": "var(--wm-bottomsheet-handle-border-color)",
            "backgroundColor": "var(--wm-bottomsheet-handle-background)"
        },
        "dragIconHandle": {
            "width": "var(--wm-bottomsheet-handle-icon-width)",
            "height": "var(--wm-bottomsheet-handle-icon-height)",
            "backgroundColor": "var(--wm-bottomsheet-handle-icon-background)"
        },
        "sheetScrollContent": {
            "backgroundColor": "var(--wm-bottomsheet-background)",
            "padding": "var(--wm-bottomsheet-content-padding)"
        }
    },
    "app-datetime-picker-modal": {
        "text": {
            "fontSize": "var(--wm-datetime-text-font-size)",
            "fontWeight": "var(--wm-datetime-text-font-weight)",
            "color": "var(--wm-datetime-text-color)"
        },
        "container": {
            "backgroundColor": "var(--wm-datetime-background)"
        },
        "header": {
            "color": "var(--wm-datetime-header-text-color)",
            "fontSize": "var(--wm-datetime-header-text-font-size)",
            "fontWeight": "var(--wm-datetime-header-text-font-weight)"
        },
        "cancelBtn": {
            "root": {
                "borderColor": "var(--wm-datetime-button-border-color)",
                "borderWidth": "var(--wm-datetime-button-border-width)",
                "borderStyle": "var(--wm-datetime-button-border-style)",
                "borderRadius": "var(--wm-datetime-button-border-radius)",
                "rippleColor": "var(--wm-datetime-button-ripple-color)",
                "backgroundColor": "var(--wm-datetime-cancel-button-background)"
            },
            "text": {
                "fontSize": "var(--wm-datetime-cancel-button-text-size)",
                "fontWeight": "var(--wm-datetime-cancel-button-text-weight)",
                "color": "var(--wm-datetime-cancel-button-text-color)"
            }
        },
        "selectBtn": {
            "root": {
                "backgroundColor": "var(--wm-datetime-selected-button-background)",
                "borderColor": "var(--wm-datetime-button-border-color)",
                "borderWidth": "var(--wm-datetime-button-border-width)",
                "borderStyle": "var(--wm-datetime-button-border-style)",
                "borderRadius": "var(--wm-datetime-button-border-radius)",
                "rippleColor": "var(--wm-datetime-button-ripple-color)"
            },
            "text": {
                "fontSize": "var(--wm-datetime-selected-button-text-size)",
                "fontWeight": "var(--wm-datetime-selected-button-text-weight)",
                "color": "var(--wm-datetime-selected-button-text-color)"
            }
        }
    },
    "app-wheel-picker": {
        "itemText": {
            "color": "var(--wm-datetime-text-color)",
            "fontSize": "var(--wm-datetime-text-font-size)",
            "fontWeight": "var(--wm-datetime-text-font-weight)"
        },
        "selectedItemText": {
            "color": "var(--wm-datetime-selected-text-color)",
            "fontSize": "var(--wm-datetime-selected-text-font-size)",
            "fontWeight": "var(--wm-datetime-selected-text-font-weight)"
        }
    }
};
