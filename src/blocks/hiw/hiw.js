function getPosition(element) {
  const elementRect = element.getBoundingClientRect();
  const scrollPosition = window.scrollY;
  const elementTop = elementRect.top + scrollPosition;

  return elementTop;
}

function setImage(id){
  function clear() {
    const images = document.getElementsByClassName('hiw__image-wrap');
    for (let i = 0; i < images.length; i++) {
      images[i].classList.remove('hiw__image-wrap_active');
    }
  }

  const image = document.getElementById(id);

  if(!image.classList.contains('hiw__image-wrap_active'))
  {
    clear();
    image.classList.add('hiw__image-wrap_active');
  }
}

let current_image = 'hiw1_image';

document.addEventListener('DOMContentLoaded', (e) => {
  const hiw1 = document.getElementById('hiw1');
  const hiw2 = document.getElementById('hiw2');
  const hiw3 = document.getElementById('hiw3');
  const hiw4 = document.getElementById('hiw4');
  const hiw5 = document.getElementById('hiw5');
  const hiw6 = document.getElementById('hiw6');

  window.onscroll = function() {
    const scrollPosition = window.scrollY;

    if (scrollPosition > getPosition(hiw1) && scrollPosition < getPosition(hiw2))
      setImage('hiw1_image');

    if(scrollPosition > getPosition(hiw2) && scrollPosition < getPosition(hiw3))
      setImage('hiw2_image');

    if(scrollPosition > getPosition(hiw3) && scrollPosition < getPosition(hiw4))
      setImage('hiw3_image');

    if(scrollPosition > getPosition(hiw4) && scrollPosition < getPosition(hiw5))
      setImage('hiw4_image');

    if(scrollPosition > getPosition(hiw5) && scrollPosition < getPosition(hiw6))
      setImage('hiw5_image');

    if(scrollPosition > getPosition(hiw6) && scrollPosition < getPosition(hiw7))
      setImage('hiw6_image');
  };
})