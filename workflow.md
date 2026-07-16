Get the issue - create a new workspace for this issue in local - ask for a location
Mandatory step - then use graphify or memorylayer (always reingest "rn-codegen-mars" and "rn-runtime-mars" on their respective repo locations and update "wm-rn" with any new arch understandings)
Then using the skill -  ~/.agents/skills/sprintly-okr-generator/ - generate a proper spec or plan in issue workspace
Ask who you are assigning to - which option or direction you want to choose, if needed - then generate an okr in issue workspace
get this spec/plan and okr saved  in issue workspace
use the spec/plan, and come up with all possible test cases, including all edge cases, hacks, bypass etc.. since this is for a  runtime app - consider performance, fps, lag, memory leaks etc... render times, multi renders, max renders etc.. and generate proper test cases report
using both spec/plan, test cases report - come up with an app design using wavemaker widget and screenshot to code skills with single or multipage to reproduce this issue or how the enhancement should work or feature - covering all edge cases - save this App design in the issue workspace
then copy the blankApp template to the issue workspace
then check if we are using min node requirement as stated in ui-build.js inside project - if not switch to that node version
Update the, codegenPath to local codegen build folder and baseDir to /tmp/
then using screenshot to code skills, update the project in issue workspace, based on the app design
then run this mvn command to get the generated project - command: mvn clean package -Dprofile.props.file="development.properties" -Dmobile.serverUrl="http://NOSERVERREQUIRED.com"



