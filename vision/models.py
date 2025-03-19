from django.db import models
import google.generativeai as genai

# Initialize the Google Generative AI client
genai.configure(api_key="AIzaSyBYlG5hoYIgA3anX2_eFSd_8aFq2r6fHYA")

class Image(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='images/')
    description = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
