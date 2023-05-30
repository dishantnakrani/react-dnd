import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? "lightgreen" : "grey",
    ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 250,
});




export default function Contact() {

    const [alldata, setAllData] = useState([])

    const [selectedImages, setSelectedImages] = useState([]);
    const submit = () => {

        let data = {
            images: selectedImages

        }

        setAllData([...alldata, data])
        console.log(alldata)
    }



    const handleImageUpload = (event) => {
        const files = event.target.files;
        const uploadedImages = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const objectURL = URL.createObjectURL(file);
            uploadedImages.push(objectURL);
        }

        setSelectedImages(uploadedImages);
    };


    //dnd code is here

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const reorderedItems = reorder(
            selectedImages,
            result.source.index,
            result.destination.index
        );

        console.log({ reorderedItems });
        setSelectedImages(reorderedItems);
    };



    return (

        <>
            <div>
                <input type="file" multiple onChange={handleImageUpload} />
                <div>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                >
                                    {selectedImages.map((image, index) => (
                                        <Draggable key={'image-' + index} draggableId={'image-' + index} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    className="card"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}
                                                >

                                                    <img className='upload-img' src={image} alt={'not found'} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                </div>

                <button onClick={submit}>submit</button>
            </div>

        </>
    )
}
