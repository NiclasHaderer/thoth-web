import React, { useState } from 'react';
import { MdEvent, MdFormatListNumbered, MdLanguage, MdPerson } from 'react-icons/all';
import { MdCollectionsBookmark, MdEdit, MdSearch } from 'react-icons/md';
import { ColoredButton } from '../Common/ColoredButton';
import { Dialog } from '../Common/Dialog';
import { Input } from '../Common/Input';

export const BookedEdit: React.VFC = () => {

  let [isOpen, setIsOpen] = useState(true);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);


  return <>
    <ColoredButton color="secondary" onClick={openModal}>
      <MdEdit className="mr-2"/> Edit
    </ColoredButton>
    <Dialog closeModal={closeModal} isOpen={isOpen} title="Edit Book" buttons={
      <div className="flex justify-between">
        <ColoredButton color="secondary" onClick={closeModal}>Cancel</ColoredButton>
        <ColoredButton>Submit</ColoredButton>
      </div>
    }>
      <Input labelClassName="w-28" label="Title" placeholder="Title" icon={<MdSearch/>} iconPosition="left"/>
      <Input labelClassName="w-28" label="Author" placeholder="Author" icon={<MdPerson/>} iconPosition="left"/>
      <Input labelClassName="w-28" label="Language" placeholder="Language" icon={<MdLanguage/>} iconPosition="left"/>
      <Input labelClassName="w-28" label="Narrator" placeholder="Narrator" icon={<MdPerson/>} iconPosition="left"/>
      <Input labelClassName="w-28" label="Series" placeholder="Series" icon={<MdCollectionsBookmark/>} iconPosition="left"/>
      <Input labelClassName="w-28" type="number" label="Series Index" placeholder="Series Index" icon={<MdFormatListNumbered/>} iconPosition="left"/>
      <Input labelClassName="w-28" type="number" label="Year" placeholder="Year" icon={<MdEvent/>} iconPosition="left"/>
    </Dialog>
  </>;
};
