import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Navbar from "./components/Navbar/Navbar";
import InputContainer from "./components/InputContainer";
import List from "./components/List";

import store from "./utils/orgStore";
import StoreApi from "./utils/storeApi";
import { supabase } from './supabaseClient'

import "./Home/styles.scss";

const dataStorage = JSON.parse(window.localStorage.getItem("dataKanbanOrg"));

const initialState = () => {
    if (dataStorage) {
        return dataStorage;
    } else {
        window.localStorage.setItem("dataKanbanOrg", JSON.stringify(store));
        return store;
    }
};

export default function Home() {
    const [members, setMembers] = useState([])
    const [data, setData] = useState(initialState);

    async function getMembers() {

        const { data } = await supabase
            .from('Members')
            .select()
        setMembers(data)
    }

    React.useEffect(() => {
        getMembers();
    }, [])

    const addMoreCard = (title, listId) => {
        if (!title) {
            return;
        }

        const newCardId = uuid();
        const newCard = {
            id: newCardId,
            title,
        };

        const list = data.lists[listId];
        list.cards = [...list.cards, newCard];

        const newState = {
            ...data,
            lists: {
                ...data.lists,
                [listId]: list,
            },
        };
        setData(newState);
        window.localStorage.setItem("dataKanbanOrg", JSON.stringify(newState));
    };
    const removeCard = (index, listId) => {
        const list = data.lists[listId];

        list.cards.splice(index, 1);

        const newState = {
            ...data,
            lists: {
                ...data.lists,
                [listId]: list,
            },
        };
        setData(newState);
        window.localStorage.setItem("dataKanbanOrg", JSON.stringify(newState));
    };

    const updateCardTitle = (title, index, listId) => {
        const list = data.lists[listId];
        list.cards[index].title = title;

        const newState = {
            ...data,
            lists: {
                ...data.lists,
                [listId]: list,
            },
        };
        setData(newState);
        window.localStorage.setItem("dataKanbanOrg", JSON.stringify(newState));
    };
    const addMoreList = (title) => {
        if (!title) {
            return;
        }

        const newListId = uuid();
        const newList = {
            id: newListId,
            title,
            cards: [],
        };
        const newState = {
            listIds: [...data.listIds, newListId],
            lists: {
                ...data.lists,
                [newListId]: newList,
            },
        };
        setData(newState);
        window.localStorage.setItem("dataKanbanOrg", JSON.stringify(newState));
    };

    const updateListTitle = (title, listId) => {
        const list = data.lists[listId];
        list.title = title;

        const newState = {
            ...data,
            lists: {
                ...data.lists,
                [listId]: list,
            },
        };

        setData(newState);
        window.localStorage.setItem("dataKanbanOrg", JSON.stringify(newState));
    };

    const deleteList = (listId) => {
        const lists = data.lists;
        const listIds = data.listIds;

        delete lists[listId];

        listIds.splice(listIds.indexOf(listId), 1);

        const newState = {
            lists: lists,
            listIds: listIds,
        };

        setData(newState);
        window.localStorage.setItem("dataKanbanOrg", JSON.stringify(newState));
    };

    const onDragEnd = (result) => {
        const { destination, source, draggableId, type } = result;

        if (!destination) {
            return;
        }

        if (type === "list") {
            const newListIds = data.listIds;

            newListIds.splice(source.index, 1);
            newListIds.splice(destination.index, 0, draggableId);

            const newState = {
                ...data,
                listIds: newListIds,
            };
            setData(newState);
            window.localStorage.setItem("dataKanbanOrg", JSON.stringify(newState));

            return;
        }

        const sourceList = data.lists[source.droppableId];
        const destinationList = data.lists[destination.droppableId];
        const draggingCard = sourceList.cards.filter(
            (card) => card.id === draggableId
        )[0];

        if (source.droppableId === destination.droppableId) {
            sourceList.cards.splice(source.index, 1);
            destinationList.cards.splice(destination.index, 0, draggingCard);

            const newState = {
                ...data,
                lists: {
                    ...data.lists,
                    [sourceList.id]: destinationList,
                },
            };
            setData(newState);
            window.localStorage.setItem("dataKanbanOrg", JSON.stringify(newState));
        } else {
            sourceList.cards.splice(source.index, 1);
            destinationList.cards.splice(destination.index, 0, draggingCard);

            const newState = {
                ...data,
                lists: {
                    ...data.lists,
                    [sourceList.id]: sourceList,
                    [destinationList.id]: destinationList,
                },
            };

            setData(newState);
            window.localStorage.setItem("dataKanbanOrg", JSON.stringify(newState));
        }
    };
    return (
        <div className="bg-blue-500">
            <Navbar page="org" />
            <div className="bg-blue w-full my-10 flex justify-center font-sans">
                <div className="rounded bg-blue-200 w-1/5 p-4">
                    <div className="flex justify-between py-1">
                        <h3 className="text-lg font-bold">Organisation Members</h3>
                    </div>
                    {members.length > 0 ? members.map(mem =>
                        <div className="text-sm mt-2">
                            <div className="bg-white p-2 rounded mt-1 border-b border-gray hover:bg-gray-100">
                                {mem.Name}
                            </div>
                        </div>
                    ) : ''}
                </div>
            </div>
            <StoreApi.Provider
                value={{
                    addMoreCard,
                    addMoreList,
                    updateListTitle,
                    removeCard,
                    updateCardTitle,
                    deleteList
                }}
            >
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="app" type="list" direction="horizontal">
                        {(provided) => (
                            <div
                                className="wrapper"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {data.listIds.map((listId, index) => {
                                    const list = data.lists[listId];

                                    return <List list={list} key={listId} index={index} />;
                                })}
                                <div>
                                    <InputContainer type="list" />
                                </div>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </StoreApi.Provider>
        </div>
    );
}
