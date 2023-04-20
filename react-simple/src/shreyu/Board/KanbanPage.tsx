import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
//import { yupResolver } from '@hookform/resolvers/yup';

import TaskItem from './Task';

// dummy data
import { tasks, TaskTypes } from './data';
import Page from 'src/components/Page';
import { Grid } from '@mui/material';

interface StateType {
  todoTasks: TaskTypes[];
  inprogressTasks: TaskTypes[];
  reviewTasks: TaskTypes[];
  doneTasks: TaskTypes[];
}

// kanban
const Kanban = () => {
  const [state, setState] = useState<StateType>({
    todoTasks: tasks.filter((t) => t.status === 'Pending'),
    inprogressTasks: tasks.filter((t) => t.status === 'Inprogress'),
    reviewTasks: tasks.filter((t) => t.status === 'Review'),
    doneTasks: tasks.filter((t) => t.status === 'Done'),
  });
  const [totalTasks, setTotalTasks] = useState<number>(tasks.length);
  const [newTaskModal, setNewTaskModal] = useState<boolean>(false);
  const [newTaskDetails, setNewTaskDetails] = useState<any>(null);

  /*
   * Form methods
   */
  const methods = useForm();
  const { handleSubmit, register, control, reset } = methods;

  /**
   * Creates new empty task with given status
   * @param status
   * @param queue
   */
  const newTask = (status: string, queue: string) => {
    setNewTaskDetails({
      dueDate: new Date(),
      status: status,
      queue: queue,
    });
    setNewTaskModal(true);
  };

  // a little function to help us with reordering the result
  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  /**
   * Moves an item from one list to another list.
   */
  const move = (
    source: Iterable<unknown> | ArrayLike<unknown>,
    destination: Iterable<unknown> | ArrayLike<unknown>,
    droppableSource: { index: number; droppableId: string | number },
    droppableDestination: { index: number; droppableId: string | number }
  ) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, removed);
    const result: any = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  /**
   * Gets the list
   */
  const getList = (id: string) => {
    const modifiedState: any = { ...state };
    const stateTasks: any = modifiedState[id] && modifiedState[id];
    return stateTasks;
  };

  /**
   * On drag end
   */
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      const items = reorder(getList(source.droppableId), source.index, destination.index);
      let localState: any = { ...state };
      localState[source.droppableId] = items;
      setState(localState);
    } else {
      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );
      const localState = { ...state, ...result };
      setState(localState);
    }
  };

  return (
    <Page title="Kanban">
      <Grid>
        <Row>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="board">
              <Col xs={4}>
                {/* todo */}
                <Droppable droppableId="todoTasks">
                  {(provided, snapshot) => (
                    <div className="tasks border" ref={provided.innerRef}>
                      <OverlayTrigger
                        key="bottom"
                        placement="bottom"
                        overlay={<Tooltip>Add New Todo Task</Tooltip>}
                      >
                        <button
                          className="btn btn-link p-0 text-secondary float-end shadow-none px-0 py-2"
                          id="addNewTodo"
                          onClick={() => newTask('Pending', 'todoTasks')}
                        >
                          <i className="uil-plus" />
                        </button>
                      </OverlayTrigger>
                      <h5 className="mt-0 task-header header-title">
                        TODO <span className="fs-13">({state.todoTasks.length})</span>
                      </h5>

                      {state.todoTasks.length === 0 && (
                        <p className="text-center text-muted pt-2 mb-0">No Tasks</p>
                      )}

                      {state.todoTasks.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id + ''} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskItem task={item} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Col>
              <Col xs={4}>
                {/* in progress */}
                <Droppable droppableId="inprogressTasks">
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} className="tasks border">
                      <OverlayTrigger
                        key="bottom"
                        placement="bottom"
                        overlay={<Tooltip>Add New In Progress Task</Tooltip>}
                      >
                        <button
                          className="btn btn-link p-0 text-secondary float-end shadow-none px-0 py-2"
                          id="addInprogressTask"
                          onClick={() => newTask('Inprogress', 'inprogressTasks')}
                        >
                          <i className="uil-plus" />
                        </button>
                      </OverlayTrigger>
                      <h5 className="mt-0 task-header header-title">
                        In Progress <span className="fs-13">({state.inprogressTasks.length})</span>
                      </h5>
                      {state.inprogressTasks.length === 0 && (
                        <p className="text-center text-muted pt-2 mb-0">No Tasks</p>
                      )}

                      {state.inprogressTasks.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id + ''} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskItem task={item} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Col>
              <Col xs={4}>
                {/* review */}
                <Droppable droppableId="reviewTasks">
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} className="tasks">
                      <OverlayTrigger
                        key="bottom"
                        placement="bottom"
                        overlay={<Tooltip>Add New Review Task</Tooltip>}
                      >
                        <button
                          className="btn btn-link p-0 text-secondary float-end shadow-none px-0 py-2"
                          id="addReviewTask"
                          onClick={() => newTask('Review', 'reviewTasks')}
                        >
                          <i className="uil-plus" />
                        </button>
                      </OverlayTrigger>
                      <h5 className="mt-0 task-header header-title">
                        Review ({state.reviewTasks.length})
                      </h5>
                      {state.reviewTasks.length === 0 && (
                        <p className="text-center text-muted pt-2 mb-0">No Tasks</p>
                      )}

                      {state.reviewTasks.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id + ''} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskItem task={item} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Col>
              <Col xs={4}>
                {/* done */}
                <Droppable droppableId="doneTasks">
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} className="tasks">
                      <OverlayTrigger
                        key="bottom"
                        placement="bottom"
                        overlay={<Tooltip>Add New Done Task</Tooltip>}
                      >
                        <button
                          className="btn btn-link p-0 text-secondary float-end shadow-none px-0 py-2"
                          id="addNewDone"
                          onClick={() => newTask('Done', 'doneTasks')}
                        >
                          <i className="uil-plus" />
                        </button>
                      </OverlayTrigger>
                      <h5 className="mt-0 task-header header-title">
                        Done ({state.doneTasks.length})
                      </h5>
                      {state.doneTasks.length === 0 && (
                        <p className="text-center text-muted pt-2 mb-0">No Tasks</p>
                      )}

                      {state.doneTasks.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id + ''} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskItem task={item} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Col>
            </div>
          </DragDropContext>
        </Row>
      </Grid>
    </Page>
  );
};

export default Kanban;
