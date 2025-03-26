# Google I - Image Analysis Web App

Google I is a web application that allows users to upload images and receive detailed AI-powered descriptions using Google's Gemini API. The application features a modern, animated UI and a gallery system to save your analyzed images.

## Features

- **Image Upload**: Drag-and-drop or browse for images to analyze
- **AI Analysis**: Uses Google's Gemini 1.5 Flash model to generate detailed descriptions
- **Image Gallery**: View, manage, and revisit all your analyzed images
- **Delete Functionality**: Remove individual images or clear the entire gallery
- **Modern UI**: Animated, responsive interface with dark mode design

## Technologies Used

- **Backend**: Django (Python)
- **Frontend**: HTML, CSS, JavaScript
- **AI**: Google Generative AI API (Gemini 1.5 Flash)
- **Styling**: Bootstrap, custom CSS animations
- **Image Processing**: Pillow
- **Deployment**: Render, Gunicorn, Whitenoise

## Local Installation

1. Clone the repository
```bash
git clone https://github.com/DrRigB/google-I.git
cd google-I
```

2. Install dependencies
```bash
pip install -r requirements.txt
```

3. Create necessary directories
```bash
mkdir -p media/images
```

4. Create a .env file with your environment variables:
```
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True
GOOGLE_API_KEY=your-google-api-key-here
```

5. Run migrations
```bash
python manage.py migrate
```

6. Start the development server
```bash
python manage.py runserver
```

7. Open your browser and navigate to http://127.0.0.1:8000/

## Deployment on Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn google_eye.wsgi:application`
   - Python Version: 3.9 or higher

4. Add the following environment variables in Render:
   - `DJANGO_SECRET_KEY`: Generate a secure secret key
   - `DEBUG`: Set to `False`
   - `GOOGLE_API_KEY`: Your Google API key

5. Deploy your application

## Usage

1. Upload an image through the drag-and-drop interface or file browser
2. Enter an optional title for your image
3. Click "Analyze Image" to process your image
4. View the AI-generated description
5. Browse your gallery to see your analysis history
6. Delete individual images or clear the entire gallery as needed

## Note

This application requires a valid Google Generative AI API key to function. The key should be configured in your environment variables.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 