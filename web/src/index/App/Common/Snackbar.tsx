import React, { Dispatch, ReactElement, SetStateAction, useContext, useState } from 'react';

export const Snackbar = React.createContext({
  elements: [] as ReactElement[],
  setElements: null as unknown as Dispatch<SetStateAction<ReactElement[]>>,
});


export const SnackbarProvider: React.FC = ({children}) => {
  const [elements, setElements] = useState<ReactElement[]>([]);

  return (
    <Snackbar.Provider value={{elements: elements, setElements: setElements}}>
      {children}
      {elements.length > 0 ?
        <div className="fixed right-0 bottom-0 p-10">
          {elements.map((e, k) => <React.Fragment key={k}>{e}</React.Fragment>)}
        </div> : null
      }
    </Snackbar.Provider>
  );
};


export const useSnackbar = () => {
  const {setElements} = useContext(Snackbar);
  return (reactElement: ReactElement, closable = true) => {
    setElements(elements => [...elements, reactElement]);
  };
};
