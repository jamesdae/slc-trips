export default function highlight(markerView, location) {
  markerView.content.classList.add('highlight');
  markerView.element.style.zIndex = 1;
}
