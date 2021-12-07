import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { MdPerson } from 'react-icons/all';
import { MdCollectionsBookmark, MdEdit, MdEvent, MdFormatListNumbered, MdLanguage, MdSearch } from 'react-icons/md';
import { BookModel } from '../../API/Audiobook';
import { useAudiobookState } from '../../State/Audiobook.State';
import { ColoredButton } from '../Common/ColoredButton';
import { Dialog } from '../Common/Dialog';
import { FormikInput } from '../Common/Input';

export const BookedEdit: React.VFC<{ book: Partial<BookModel> & { id: string } }> = ({book}) => {

  let [isOpen, setIsOpen] = useState(false);
  const updateBook = useAudiobookState(state => state.patchBook);

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
      <Formik
        initialValues={{
          title: book.title,
          author: book.author?.name || '',
          language: book.language || '',
          narrator: book.narrator || '',
          series: book.series?.title || '',
          year: book.year || undefined,
          seriesIndex: book.seriesIndex || undefined,
        }}
        onSubmit={(values) => updateBook({
          id: book.id,
          author: values.author || null,
          language: values.language || null,
          narrator: values.narrator || null,
          series: values.series || null,
          seriesIndex: values.seriesIndex || null,
          title: values.title || null,
        })
        }>
        <Form>
          <>
            <FormikInput name="title" labelClassName="w-28" label="Title" icon={<MdSearch/>}/>
            <FormikInput name="author" labelClassName="w-28" label="Author" icon={<MdPerson/>}/>
            <FormikInput name="language" labelClassName="w-28" label="Language" icon={<MdLanguage/>}/>
            <FormikInput name="narrator" labelClassName="w-28" label="Narrator" icon={<MdPerson/>}/>
            <FormikInput name="series" labelClassName="w-28" label="Series" icon={<MdCollectionsBookmark/>}/>
            <FormikInput name="year" labelClassName="w-28" type="number" label="Year" icon={<MdEvent/>}/>
            <FormikInput name="seriesIndex" labelClassName="w-28" type="number" label="Series Index"
                         icon={<MdFormatListNumbered/>}/>
            <button type="submit">Submit</button>
          </>
        </Form>
      </Formik>
    </Dialog>
  </>;
};
