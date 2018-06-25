mkdir -p output

for file in *256.png
do
	name=${file/256.png/}
	convert $file -resize 16x16 output/"$name"16.png
	convert $file -resize 32x32 output/"$name"32.png
	convert $file -resize 64x64 output/"$name"64.png
	convert $file -resize 128x128 output/"$name"128.png
	cp $file output/$file
	convert output/"$name"16.png output/"$name"32.png output/"$name"64.png output/"$name"128.png output/"$name"256.png output/"$name".ico
done
