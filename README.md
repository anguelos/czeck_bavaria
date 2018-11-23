Document image analysis tools.

# bin/grouting

An annotation tool running as a minimal webserver:
* grouting is a GROUnd-TruthIMG tool meant for rapid annotation of text regions in images.
* No authorization or authentication is implemented. The service assumes a perfectly safe network firewall.
* The service must be given one or more images as a parameter.
* Groundtruth is stored by the server at same path as each provided image with a file-extention of .json
* Once the server is started, point your browser to http://127.0.0.1:8080/ ; ideally use Google chrome.

```bash
#Instaling requirements:
pip install --user jinja2 cherrypy opencv-python tqdm
```

```bash
#Starting the service:
python ./bin/grouting sample_data/img/*jpg
```

# sample_data/img

Sample Images with a non restrictive licence:
* [mauscript1.jpg](https://c.pxhere.com/photos/70/1b/manuscript_ancient_writing_document_map_old_museum_archive-920944.jpg!d)
* [mauscript2.jpg](https://c.pxhere.com/photos/09/5f/manuscript_book_ancient_old_document_archive-919448.jpg!d)

