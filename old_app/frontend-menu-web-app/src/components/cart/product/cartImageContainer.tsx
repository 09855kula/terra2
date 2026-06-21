import {CartImage, Container, Delete, DeleteButton} from "./styled";

import DefaultImage from '../../../assets/product.png'
import {Image} from "../../common";
import React from 'react'
import deleteIcon from "../../../assets/icons/delete.svg";
import useVisible from "../../../hooks/useVisible";

export default function CartImageContainer({img_url, deleteHandler, editMode}: PropsType) {
    const {ref, isVisible, setIsVisible} = useVisible(false)
    let new_img_url
    if (img_url && img_url.match(/imgur/) && !img_url.match(/imgur.*\.jpg$/)) {
        // img_url = img_url.replace('imgur', 'i.imgur');
        new_img_url = img_url +'.jpg';
    }
    else if (img_url && img_url.match(/postimg/) && !img_url.match(/postimg.*\.jpg$/)) {
        // img_url = img_url.replace('imgur', 'i.imgur');
        new_img_url = img_url +'.jpg';
    }

    else {
        new_img_url = img_url
    }
    const deleteProduct = () => {
        setIsVisible(false)
        deleteHandler()
    }
    
    return (
        <Container>
        {editMode && !isVisible &&
            <Delete onClick={() => setIsVisible(true)}>
                <Image 
                    height='22px'
                    width='22px'
                    padding='7px'
                    src={deleteIcon} 
                />
            </Delete>}
            <CartImage 
                src={new_img_url}
                onError={(e: any) => {e.target.onerror = null; e.target.src=`${DefaultImage}`}}
                />
            {isVisible &&
            <DeleteButton ref={ref} onClick={deleteProduct}>
                Tap to confirm
            </DeleteButton>}
        </Container>            
    )
}

interface PropsType {
    img_url: string
    deleteHandler: () => void
    editMode: boolean
}