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

## Installation

1. Clone the repository
```bash
git clone https://github.com/DrRigB/google-I.git
cd google-I
```

2. Install dependencies
```bash
pip install django google-generativeai Pillow
```

3. Create necessary directories
```bash
mkdir -p media/images
```

4. Run migrations
```bash
python manage.py migrate
```

5. Start the development server
```bash
python manage.py runserver
```

6. Open your browser and navigate to http://127.0.0.1:8000/

## Usage

1. Upload an image through the drag-and-drop interface or file browser
2. Enter an optional title for your image
3. Click "Analyze Image" to process your image
4. View the AI-generated description
5. Browse your gallery to see your analysis history
6. Delete individual images or clear the entire gallery as needed

## Note

This application requires a valid Google Generative AI API key to function. The key should be configured in the `vision/models.py` file.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 