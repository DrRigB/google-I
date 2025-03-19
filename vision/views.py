from django.shortcuts import render, redirect, get_object_or_404
from django.conf import settings
from .models import Image
import google.generativeai as genai
import base64
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from PIL import Image as PILImage
import io

def index(request):
    return render(request, 'vision/index.html')

def gallery(request):
    # Get all images ordered by most recent first
    images = Image.objects.all().order_by('-uploaded_at')
    return render(request, 'vision/gallery.html', {'images': images})

def delete_image(request, image_id):
    if request.method == 'POST':
        try:
            # Get the image or return 404 if not found
            image = get_object_or_404(Image, id=image_id)
            
            # Store the image path before deleting from database
            image_path = os.path.join(settings.MEDIA_ROOT, image.image.name)
            
            # Store title for flash message
            image_title = image.title
            
            # Delete from database first
            image.delete()
            
            # Delete the image file from storage if it exists
            try:
                if os.path.exists(image_path):
                    os.remove(image_path)
                    print(f"Successfully deleted file: {image_path}")
                else:
                    print(f"File not found: {image_path}")
                    
                # Check if the parent directory is empty (except for .gitkeep)
                parent_dir = os.path.dirname(image_path)
                if os.path.exists(parent_dir):
                    dir_contents = os.listdir(parent_dir)
                    # If directory only contains .gitkeep or is empty, leave it
                    if len(dir_contents) <= 1 and (not dir_contents or '.gitkeep' in dir_contents):
                        print(f"Directory is now empty: {parent_dir}")
            except OSError as e:
                # Log the error but continue
                print(f"Error deleting file {image_path}: {e}")
                
            # Redirect back to gallery with success message
            return redirect('vision:gallery')
            
        except Exception as e:
            # Log exception
            print(f"Error during image deletion: {e}")
            return redirect('vision:gallery')
            
    # If not a POST request, redirect to gallery
    return redirect('vision:gallery')

@csrf_exempt
def analyze_image(request):
    if request.method == 'POST':
        if 'image' in request.FILES:
            # Create and save an Image instance
            title = request.POST.get('title', 'Untitled')
            image_obj = Image(title=title, image=request.FILES['image'])
            image_obj.save()
            
            # Get the path to the saved image
            image_path = os.path.join(settings.MEDIA_ROOT, image_obj.image.name)
            
            # Analyze the image with Gemini
            try:
                # Get the model
                model = genai.GenerativeModel('gemini-1.5-flash')
                
                # Open the image using PIL
                img = PILImage.open(image_path)
                
                # Call the Gemini API
                response = model.generate_content(["""Describe this image in detail, I need you to decide weather to act scared by an image, or swooon over it and glaze it for being so atrative and have the hots for the image, I need you to be really mean if you want to be mean and be a tough critic, or take it professionally and do a very detailed normal response. Overall just be have personality and change up based on the immage, also rate every image out of 10.""", img])
                description = response.text
                
                # Update the image description in the database
                image_obj.description = description
                image_obj.save()
                
                return JsonResponse({
                    'success': True,
                    'description': description,
                    'image_url': image_obj.image.url,
                    'image_id': image_obj.id
                })
            
            except Exception as e:
                return JsonResponse({
                    'success': False,
                    'error': str(e)
                })
        
        return JsonResponse({
            'success': False,
            'error': 'No image uploaded'
        })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

def clear_gallery(request):
    if request.method == 'POST':
        try:
            # Get all images
            images = Image.objects.all()
            
            # Delete all image files from storage
            for image in images:
                image_path = os.path.join(settings.MEDIA_ROOT, image.image.name)
                try:
                    if os.path.exists(image_path):
                        os.remove(image_path)
                        print(f"Deleted file: {image_path}")
                except OSError as e:
                    print(f"Error deleting file {image_path}: {e}")
            
            # Delete all images from the database
            deleted_count = images.count()
            images.delete()
            print(f"Deleted {deleted_count} images from the database")
            
            # Redirect back to gallery
            return redirect('vision:gallery')
            
        except Exception as e:
            print(f"Error clearing gallery: {e}")
            return redirect('vision:gallery')
            
    # If not a POST request, redirect to gallery
    return redirect('vision:gallery')
