import React, { type Node } from 'react';
import { refs } from '../../api';

const initialContext = {
  filter: {
    parent: 'all',
    children: [{ date: null }, { label: null }]
  },
  pages: [],
  search_text: '',
  conversations: [],
  conversation_select: null,
  newMessage: null
};

// types
const FILTER = 'cons/filter';
const LOAD_CONS_DONE = 'cons/load_cons_done';
export const SELECT_CONVERSATION = 'cons/select_conversation';
export const UPDATE_MESSAGE = 'cons/update_message';
export const CHANGE_TEXT_SEARCH = 'cons/change_text_search';
export const ADD_PAGE = 'cons/add_page';
export const REMOVE_PAGE = 'cons/remove_page';
export const RESET_PAGE = 'cons/reset_page';

const consReducer = (state, action) => {
  switch (action.type) {
    case LOAD_CONS_DONE:
      return { ...state, conversations: action.payload };
    case FILTER:
      return { ...state, filter: action.payload };

    case RESET_PAGE:
      return { ...state, pages: [] };
    case ADD_PAGE:
      return { ...state, pages: [...state.pages, action.payload] };
    case REMOVE_PAGE: {
      const pages = state.pages.filter(page => page.id !== action.payload.id);
      return { ...state, pages };
    }

    case SELECT_CONVERSATION:
      return { ...state, conversation_select: action.payload };

    case CHANGE_TEXT_SEARCH:
      return { ...state, search_text: action.payload };

    case UPDATE_MESSAGE: {
      const conversation_select =
        state.conversation_select &&
        state.conversation_select.id === action.payload.id
          ? action.payload
          : state.conversation_select;
      return { ...state, newMessage: action.payload, conversation_select };
    }

    default:
      return state;
  }
};

const ConvsContext = React.createContext(initialContext);

type ProviderConvsContextProps = { children: Node };

const ProviderConvsContext = ({ children }: ProviderConvsContextProps) => {
  const [state, dispatch] = React.useReducer(consReducer, initialContext);

  const value = React.useMemo(() => [state, dispatch], [state]);

  return (
    <ConvsContext.Provider value={value}>{children}</ConvsContext.Provider>
  );
};

const useConvs = () => {
  const context = React.useContext(ConvsContext);

  const [state, dispatch] = context;

  // filter parent
  const handleChangeParent = filter => {
    const newState = { ...state.filter, parent: filter };
    dispatch({ type: FILTER, payload: newState });
  };

  // filter children
  const handleChangeChildren = filter => {
    const { children } = state.filter;

    let newChildren = children.includes(filter)
      ? children.filter(c => c !== filter)
      : [...children, filter];

    if (filter === 'has_phone') {
      newChildren = newChildren.filter(f => f !== 'not_phone');
    }
    if (filter === 'not_phone') {
      newChildren = newChildren.filter(f => f !== 'has_phone');
    }

    if (filter.date) {
      newChildren = newChildren.map(o => {
        if (o.date) return filter;

        return o;
      });
    }

    if (filter.label) {
      newChildren = newChildren.map(o => {
        if (o.label) return filter;

        return o;
      });
    }

    if (filter.postId) {
      newChildren = newChildren.map(o => {
        if (o.postId) return filter;

        return o;
      });
    } else {
      newChildren = newChildren.filter(o => !o.postId);
    }

    return dispatch({
      type: FILTER,
      payload: { ...state.filter, children: newChildren }
    });
  };

  // reset filter
  const handleChangeReset = () => {
    const resetFilter = {
      parent: 'all',
      children: [],
      search_text: ''
    };

    dispatch({ type: FILTER, payload: resetFilter });
  };

  // change text search
  const handleChangeText = text => {
    dispatch({ type: CHANGE_TEXT_SEARCH, payload: text });
  };

  // load conversation
  const getListCons = page => {
    const ref = refs.activitysRefs
      .where('pageId', '==', page.id)
      .orderBy('updatedTime', 'desc');

    ref.get().then(snapshot => {
      console.log(snapshot);
    });
  };

  const loadConversations = user => {
    if (!user) return null;

    const { facebookPages } = user;

    return facebookPages.forEach(page => getListCons(page));
  };

  // handle select conversation
  const selectConversation = conversation =>
    dispatch({ type: SELECT_CONVERSATION, payload: conversation });

  // reset page
  const resetPage = () => dispatch({ type: RESET_PAGE });
  // add page
  const addPage = page => dispatch({ type: ADD_PAGE, payload: page });
  // remove page
  const removePage = page => dispatch({ type: REMOVE_PAGE, payload: page });

  return {
    state,
    dispatch,
    handleChangeParent,
    handleChangeReset,
    handleChangeChildren,
    loadConversations,
    selectConversation,
    handleChangeText,
    addPage,
    removePage,
    resetPage
  };
};

export { ConvsContext, ProviderConvsContext, useConvs };
