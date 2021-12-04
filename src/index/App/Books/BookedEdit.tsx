import React, { useState } from 'react';
import { MdEdit, MdSearch } from 'react-icons/md';
import { ColoredButton } from '../Common/ColoredButton';
import { Dialog } from '../Common/Dialog';
import { Input } from '../Common/Input';

export const BookedEdit: React.VFC = () => {

  let [isOpen, setIsOpen] = useState(true);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);


  return <>
    <ColoredButton className="bg-elevate" onClick={openModal}>
      <MdEdit className="mr-2"/> Edit
    </ColoredButton>
    <Dialog closeModal={closeModal} isOpen={isOpen} title="something">
      <Input label="hello" placeholder="world" icon={<MdSearch/>} iconPosition="left"/>
      <Input label="hello" placeholder="world" icon={<MdSearch/>} iconPosition="left"/>
      <Input placeholder="world" icon={<MdSearch/>}/>
      <Input label="hello" placeholder="world" icon={<MdSearch/>} iconPosition="left"/>
      <Input label="hello" placeholder="world" icon={<MdSearch/>} iconPosition="left"/>
      <Input label="hello" placeholder="world" icon={<MdSearch/>} iconPosition="left"/>
      <Input label="hello" placeholder="world" icon={<MdSearch/>} iconPosition="left"/>
    </Dialog>
  </>;
};
