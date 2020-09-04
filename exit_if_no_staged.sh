staged_file_count=$(git diff --name-only --cached | wc -l)

if [ $staged_file_count -eq 0 ];
then
  echo "**********************"
  echo ""
  echo "No staged changes!"
  echo ""
  echo "**********************"
  exit 1
fi