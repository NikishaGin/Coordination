import { useEffect, useState } from 'react';
import InteractionForm from './InteractionForm.jsx';
import InteractionCard from './InteractionCard.jsx';
import {Container, AddButton, InteractionsList, EmptyState} from './styles.js';
import { useDispatch, useSelector } from "react-redux";
import { fetchGetInteractions } from "../../../../store/interactionsSlice.js";
import { useParams } from "react-router";

const InteractionResultForm = () => {
    const {inn} = useParams()
    const dispatch = useDispatch();
    const interactions = useSelector((state) => state.interactions.interactions);
    const [isFormOpen, setIsFormOpen] = useState(false); // флаг открыта ли форма
    const [editingIndex, setEditingIndex] = useState(null); // Если null значит добавляется новая запись

    useEffect(() => {
        dispatch(fetchGetInteractions({source: "gmu", inn}))
    }, [])

    const handleAddClick = () => {
        setIsFormOpen(true);
        setEditingIndex(null);
    };

    const handleFormCancel = () => {
        setIsFormOpen(false);
        setEditingIndex(null);
    };

    const handleFormSubmit = (interactionData) => {


        console.log(interactionData);


        // if (editingIndex !== null) {
        //
        //
        //     const updatedInteractions = [...interactions];
        //     updatedInteractions[editingIndex] = interactionData;
        //     setInteractions(updatedInteractions); ///////////////////////////////////////
        // } else {
        //     setInteractions([...interactions, interactionData]); ///////////////////////
        // }




        setIsFormOpen(false);
        setEditingIndex(null);
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setIsFormOpen(true);
    };

    return (
        <Container>

            {!isFormOpen && (
                <AddButton onClick={handleAddClick}>
                    Добавить результат взаимодействия с ГМУ ФССП
                </AddButton>
            )}

            {isFormOpen && (
                <InteractionForm
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    initialData={editingIndex !== null ? interactions[editingIndex] : null}
                />
            )}
            <InteractionsList>
                {interactions.length > 0 ? (
                    interactions.map((interaction, index) => (
                        <InteractionCard
                            key={index}
                            data={interaction}
                            onEdit={() => handleEdit(index)}
                        />
                    ))
                ) : (
                    !isFormOpen && (
                        <EmptyState>
                            Записи о взаимодействиях отсутствуют. Добавьте новую запись, нажав кнопку выше.
                        </EmptyState>
                    )
                )}
            </InteractionsList>
        </Container>
    );
};

export default InteractionResultForm;