export default function unhighlight(markerView, location) {
  markerView.content.classList.remove('highlight');
  markerView.element.style.zIndex = '';
}
