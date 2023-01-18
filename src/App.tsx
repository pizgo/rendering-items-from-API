import React, { useState } from "react";
import { Container, Alert } from "@mui/material/";
import ProductSearchField from "./components/ProductSearchField";
import ProductList from "./components/ProductList";
import PaginateButtons from "./components/PaginateButtons";
import SingleProduct from "./components/SingleProduct";
import { Product } from "./types/interfaces";
import { searchParams } from './consts/urlParams';
import { useFetchProducts } from "./hooks/useFetchProducts";
import {useUserInteracted} from "./hooks/useUserInteracted";

const App: React.FC = () => {
    const initialProductId = searchParams.get("id") || "";
    const initialPageNumber = Number(searchParams.get("page")) || 1;

    const { productsState, errorMessage, callForData } = useFetchProducts(
        initialProductId,
        initialPageNumber,);

    const { handleInteraction, filteredId, pageNumber } = useUserInteracted(initialPageNumber, initialProductId, callForData)

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [chosenProduct, setChosenProduct]= useState<Product>();

    const handleFilterIdChange = (enteredId : string) : void => {
        handleInteraction(1, enteredId)
    }

    const handleArrowClick = (dir: "prev" | "next") => {
        const newPageNumber : number =
            dir === "next" ? pageNumber + 1 : pageNumber - 1;
        handleInteraction(newPageNumber, filteredId)
    }

    const handleChooseProduct = (item: Product) : void => {
            setIsModalOpen(true);
            setChosenProduct(item);
    }
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <Container maxWidth="sm" sx={{mt: 5}}>
            {errorMessage &&
                <Alert severity='error'
                    sx={{mb: 3}}>
                    {errorMessage}</Alert>}
            <ProductSearchField onChangeInput= {handleFilterIdChange}
                                value={filteredId}/>
            {!errorMessage && <ProductList
                products={productsState ? productsState.data : [] } //todo introduce initial state
                onChooseProduct= {handleChooseProduct}/>}
            {!errorMessage && <PaginateButtons
                onHandleNext= {() => handleArrowClick("next")}
                onHandlePrev= {() => handleArrowClick("prev")}
                filteredId={filteredId}
                pageNumberFromApi = {pageNumber}
                totalPagesFromApi = { productsState ? productsState.total_pages : 0 }/>} //todo introduce initial state
            <SingleProduct
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                product={chosenProduct}/>
        </Container>
    )
}

export default App;