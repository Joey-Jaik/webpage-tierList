//create variable to hold all the movie images 
const movieImages = document.querySelectorAll(".image");

//create variable to hold all the tier containers where the images can be dropped
const tiers = document.querySelectorAll(".tier");

//create variable to store the movie image currently being dragged by user
let draggedItem = null;

//create image variable and set to 1x1px transparent square
var img = new Image();
img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

//loop through the movie images adding a drag event listeners to each one
movieImages.forEach(element => {
    //when a drag is started then assign draggedItem with that item
    element.addEventListener("dragstart", (e) => {
        draggedItem = element;
        //add styling for when item is currently being dragged
        element.classList.add("dragging");
        //set drag image using img variable declared above so that drag preview is not visible during drag
        e.dataTransfer.setDragImage(img, 0, 0);
    });

    //reset draggedItem back to null once dragging has finished and remove dragging styling
    element.addEventListener("dragend", (e) => {
        draggedItem = null;
        element.classList.remove("dragging");
    });
});

//loop through the tier elements adding drag event listeners to each one
tiers.forEach(element => {
    element.addEventListener("dragover", (e) => {

        //prevent default behaviour to allow for items to be dropped inside
        e.preventDefault();

        //use getDragAfterElement() function to determine the placement of the dragged element, and store in variable
        const afterElement = getDragAfterElement(element, e.clientX);
        //use drop logic to add preview of location where element would be dropped
        if(afterElement == null){
           element.appendChild(draggedItem); 
        } else {
            element.insertBefore(draggedItem, afterElement);
        }
        draggedItem.classList.add("ranked");

        //create variables to hold the scroll speed and the distance where scrolling will start
        const scrollSpeed = 50;
        const upperThreshold = 150;
        const lowerThreshold = window.innerHeight - threshold;
    
        if (e.clientY < upperThreshold) {
            //use scrollBy() function to have window scroll up, 0 on x-axis and negative scroll speed on y-axis to ensure page scrolls up 
            window.scrollBy(0, -scrollSpeed);
        } else if (e.clientY > lowerThreshold) {
            //scroll is 0 on x-axis, and scrollSpeed to positive to ensure page scrolls down
            window.scrollBy(0, scrollSpeed);
        }
    });

    element.addEventListener("drop", (e) => {
        //prevent default behaviour to allow for items to be dropped inside
        e.preventDefault();

        //ensure that movie image for Pig will automatically move to the Pig-tier...as that is where that movie belongs
        if(draggedItem.id === "Pig"){
            document.getElementById("Pig-tier").appendChild(draggedItem);
            return;
        }

        //if an image is being dragged then add that image to the tier
        if(draggedItem){
            //use getDragAfterElement() function to determine the location of the dragged element, and store in variable
            const afterElement = getDragAfterElement(element, e.clientX);
            //if there is not a closest element then place item in its default location, else insert the dragged element before the element returned by getDragAfterElement()
            if(afterElement == null){
                 element.appendChild(draggedItem);
            } else{
                element.insertBefore(draggedItem, afterElement);
            }
            //resize the image for formatting purposes after it has been placed
            draggedItem.classList.add("ranked");
        }
    });
});

//
const movieContainer = document.querySelector(".movie-container");

movieContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    movieContainer.classList.add("drag-over");

    //create variables to hold the scroll speed and the distance where scrolling will start
    const scrollSpeed = 50;
    const upperThreshold = 150;
    const lowerThreshold = window.innerHeight - threshold;

    if (e.clientY < upperThreshold) {
        //use scrollBy() function to have window scroll up, 0 on x-axis and negative scroll speed on y-axis to ensure page scrolls up 
        window.scrollBy(0, -scrollSpeed);
    } else if (e.clientY > lowerThreshold) {
        //scroll is 0 on x-axis, and scrollSpeed to positive to ensure page scrolls down
        window.scrollBy(0, scrollSpeed);
    }
});

movieContainer.addEventListener("dragleave", (e) => {
    movieContainer.classList.remove("drag-over");
})

movieContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    movieContainer.appendChild(draggedItem);
    draggedItem.classList.remove("ranked");
    movieContainer.classList.remove("drag-over");
});

/**********************************  FUNCTIONS *****************************************************/

/*
Name: getDragAfterElement()
Accepts: container that you are wanting to drop element into and the x position of the mouse
Returns: the closest element in the container where the dragged item should be inserted
Purpose: determine the placement of the dragged element relative to the other elements within a tier
 */
function getDragAfterElement(tier, x){
    //select all the image elements inside tier, except element currently being dragged and store in array
    const draggableElements = [...tier.querySelectorAll(".image:not(.dragging)")];

    //use reduce() function on draggableElements[] to iterate over these draggable elements and compare their positions, and return the closest element to where the user is dragging
    return draggableElements.reduce((closest, child) => {
        //create a variable that will hold an object that contains the size and position of the draggable element
        const box = child.getBoundingClientRect();
        //calculate the offset to see how far away the x-coordinate of the mouse is away from the center of the draggable element
        const offset = x - (box.left + box.width / 2);
        //ignore any positive offsets as they are behind x, and any offsets that are greater than the current closests elements offset as this means they are farther away, if both are true then replace current value of closest, else closest remains the same
        if(offset < 0 && offset > closest.offset){
            return { offset: offset, element: child };
        } else {
            return closest;
        }
        //ensure starting element is far enough away that first looked at element will guaranteed to be closer, and that the actual desired element is returned from the function
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
