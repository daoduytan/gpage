import { Input } from 'antd';
import styled from 'styled-components';
import theme from '../../theme';

const { TextArea } = Input;

// conversations
const Column = styled.div`
  height: calc(100vh - ${theme.size.header + 60}px);
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${theme.color.border};

  .columnTop {
    height: 45px;
    border-bottom: 1px solid ${theme.color.border};
  }
`;

const FormSearchStyle = styled.form`
  display: flex;
  flex: 1;
  align-items: center;
  position: relative;

  .icon {
    width: 40px;
    line-height: 52px;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
  }

  input {
    flex: 1;
    border: none;
    height: 45px;
    background: transparent;
    padding-left: 40px;
    position: relative;
  }
`;

const ConversationItemStyle = styled.div`
display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.size.space - 5}px;
  background: ${({ active }) => (active ? theme.color.light : '#fff')};
  cursor: pointer;
  position: relative;

  &:after {
    content: '';
    display: block;
    width: 3px;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    background: ${({ active }) =>
      active ? theme.color.primary : 'transparent'};
  }

  &:hover {
    background: ${theme.color.light};
`;

const ConversationItemContent = styled.div`
  flex: 1;
  padding-left: ${theme.size.space - 5}px;
  padding-right: ${theme.size.space - 5}px;
  display: flex;
  flex-direction: column;
  width: 100px;

  .username {
    font-weight: 600;
    display: flex;
    align-items: center;
  }

  .message {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ConversationItemRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .date {
    margin-bottom: ${theme.size.space - 5}px;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

// message list
const background = (type, isAdmin) => {
  if (type === 'image' || type === 'sticker') {
    return 'transparent';
  }

  if (isAdmin) {
    return theme.color.primary;
  }

  return theme.color.light;
};

const padding = (type, isAdmin) => {
  if (type === 'image' || type === 'sticker') {
    return '0';
  }

  return '6px 12px 7px';
};
const MessageBubbleStyle = styled.div`
  float: ${({ isAdmin }) => (isAdmin ? 'right' : 'left')};
  position: relative;
  max-width: 65%;
  clear: both;
  display: inline-block;
  background: ${({ isAdmin, type }) => background(type, isAdmin)}
  color: ${({ isAdmin }) => (isAdmin ? '#fff' : '#000')};
  border-radius: 20px;
  margin: 3px 0;
  padding: ${({ isAdmin, type }) => padding(type, isAdmin)};
  position: relative;  

  &:hover {
    .info {
      display: block;
    }
  }

  .img {
    display: block;
    width: 100%;
    max-width: 200px;
    border: 1px solid ${theme.color.border};
    overflow: hidden;
    border-radius: 20px
  }
 
  .info {
    display: none;
    padding: 0 10px;
    position: absolute; 
    bottom: 0;
    color: #333;
    right: ${({ isAdmin }) => (isAdmin ? 'calc(100% )' : 'auto')};
    left: ${({ isAdmin }) => (isAdmin ? 'auto' : 'calc(100% )')};
    font-size: 12px;
    line-height: 1.2;

    .name {
      cursor: pointer;
      padding: 1px 3px;
      border-radius: 2px
      font-weight: 600;
      white-space: nowrap;

      &:hover {
        background: ${theme.color.light}
      }
    }

    .time {
      white-space: nowrap;
    }

    span {
      display: inline-block;
      padding: 1px 3px;
      font-size: 10px;
    }
    
  }

`;

const MessageBubbleActionStyle = styled.div`
  display: flex;
  padding-left: 15px;
  clear: both;
  justify-content: ${({ isAdmin }) => (isAdmin ? 'flex-end' : 'flex-start')};

  .item {
    display: inline-block;
    margin-right: 5px;
    cursor: pointer
    font-size: 12px;

   

    &:hover {
      color: ${theme.color.primary};
    }
  }
`;

const BoxReplyInput = styled(TextArea)`
  border: none !important;
  padding-top: 10px !important;
  padding-bottom: 10px !important;
  white-space: pre-line;

  &:focus {
    outline: none !important;
    box-shadow: none !important;
    border: none !important;
  }
`;

// Label
const LabelListWrap = styled.div`
  border-top: 1px solid ${theme.color.border};
  border-bottom: 1px solid ${theme.color.border};
  display: grid;
  background: #ddd;
`;
const LabelStyle = styled.div`
  height: ${({ size }) => (size === 'sm' ? 20 : 25)}px;
  line-height: ${({ size }) => (size === 'sm' ? 20 : 25)}px;
  padding: 0 5px;
  display: inline-block;
  text-align: center;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  opacity: ${({ active }) => (active ? 1 : 0.2)};
  cursor: pointer;
  border-radius: 2px;

  &:hover {
    opacity: 0.5;
  }
`;

// ActionBottom
const ActionBottomWrap = styled.div`
  text-align: right;
  border-top: 1px solid ${theme.color.border};
`;

const LabelModelStyle = styled.div`
  height: 40px;
  display: inline-flex;
  padding: 0 10px;
  align-items: center;
  border-left: 1px solid ${theme.color.border};
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: ${theme.color.light};
  }
`;

// ListQuickQuestion
const ListQuickAnwersWrap = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: pink;
`;

const AnswerRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${theme.size.space - 5}px;
  border-bottom: 1px solid ${theme.color.border};
  cursor: pointer;
  background: ${({ selected }) =>
    selected ? `${theme.color.primary} !important` : '#fff'};

  color: ${({ selected }) => (selected ? `#fff !important` : theme.color.text)};

  &:last-child {
    border: none;
  }

  &:hover {
    background: ${theme.color.light};
  }
`;

// note customer
const NoteItemStyle = styled.div`
  background: #eee;
  margin-bottom: 5px;
  border-radius: 10px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LabelFilterStyle = styled.div`
  display: inline-block;
  cursor: pointer;
  margin: 2px;
  padding: 3px 5px;
  background: ${({ active }) => (active ? '#2e3191' : '#e3e4e6')};
  color: ${({ active }) => (active ? '#fff' : '#555')};
  border-radius: 2px;
  cursor: ${({ loading }) => (loading ? 'no-drop' : 'pointer')};
`;

// Detail conversation
const ConvsDetailTop = styled.div`
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: ${theme.size.space}px;
`;

const TopNameStyle = styled.span`
  display: inline-block;
  padding: 2px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;

  &:hover {
    background: #ddd;
  }
`;

const TopAction = styled.div`
  display: flex;

  .item {
    display: inline-block;
    margin-right: ${theme.size.space}px;
    font-size: 22px;
    cursor: pointer;
    line-height: 45px;

    &:hover {
      color: ${theme.color.primary};
    }
  }
`;

const PageAction = styled.div`
  display: flex;
  align-items: center;
  height: 45px;
  padding: 0 ${theme.size.space}px;
  border-left: 1px solid ${theme.color.border};

  span {
    color: #333;
  }
`;

// ConversationBlank
const ConversationBlankWrap = styled.div`
  min-height: calc(100vh - 110px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

// MessageBubbleLoading
const MessageBubbleLoadingStyle = styled.div`
  position: relative;
  clear: both;
  padding: 6px 0 0;
  text-align: right;

  .loading {
    position: absolute;
    display: inline-block;
    background: #fff;
    height: 20px;
    width: 20px;
    text-align: center;
    right: 0px;
    bottom: -10px;
    border-radius: 50%;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
  }
`;

export {
  Column,
  FormSearchStyle,
  ConversationItemStyle,
  ConversationItemContent,
  ConversationItemRight,
  MessageBubbleStyle,
  MessageBubbleActionStyle,
  BoxReplyInput,
  // label
  LabelListWrap,
  LabelStyle,
  // ActionBottom
  ActionBottomWrap,
  LabelModelStyle,
  // ListQuickQuestion
  ListQuickAnwersWrap,
  AnswerRow,
  // note customer
  NoteItemStyle,
  LabelFilterStyle,
  // Detail conversation
  TopNameStyle,
  ConvsDetailTop,
  TopAction,
  PageAction,
  ConversationBlankWrap,
  // MessageBubbleLoading
  MessageBubbleLoadingStyle
};
