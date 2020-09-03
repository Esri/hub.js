staged_file_count=$(git diff --name-only --cached | wc -l)

if [ $staged_file_count -eq 0 ];
then
  git add -A
fi