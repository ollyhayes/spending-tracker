for file in $(find public -type f -size +10k)
do
	gzip --force --best --keep $file
done
