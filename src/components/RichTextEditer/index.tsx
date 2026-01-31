'use client'

import React, { useEffect, useRef, useState, ChangeEvent } from 'react'
import { ControllerRenderProps } from 'react-hook-form'


// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// import ReactQuill from 'react-quill'
import ReactQuill from 'react-quill-new';

// import 'react-quill/dist/quill.snow.css'
import 'react-quill-new/dist/quill.snow.css';

interface CharacterCountQuillProps {
  maxLength?: number
  maxChara?: string
  placeholder: string
  readOnly?: boolean
  value?: string
  onChange: (value: string) => void
  setValue?: (value: string) => void
  ErrorMessage?: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLParagraphElement> &
      React.RefAttributes<HTMLParagraphElement>
  >
  field?: ControllerRenderProps<
    {
      content?: string
    },
    'content'
  >
}

const CharacterCountQuill: React.FC<CharacterCountQuillProps> = ({
  ErrorMessage,
  maxLength,
  maxChara,
  placeholder,
  field,
  value,
  readOnly,
  onChange,
  setValue,
}) => {
  const ref = useRef<any>(null)
  const [count, setCount] = useState(0)
  // function removeTags(str) {
  //   if (str === null || str === '') return false
  //   else str = str?.toString()
  //   return str.replace(/(<([^>]+)>)/gi, '')
  // }
  // const truncateHtmlTags = ref?.current?.unprivilegedEditor?.getText()


  // const handleChange = (value:any) => {
  //   setValue(value)
  // }
  const characterCount = (event:any) => {
    const unprivilegedEditor = ref.current.unprivilegedEditor
    if (
      unprivilegedEditor.getText() &&
      unprivilegedEditor.getLength() > 8000 &&
      event.key !== 'Backspace'
    )
      event.preventDefault()
  }
  // const truncateHtmlTags = ref?.current?.unprivilegedEditor?.getText()
  // useEffect(() => {
  //   ref?.current?.editor?.emitter?.on('text-change', (event:any) => {
  //     let limit = maxLength
  //     if (event?.length() > limit) {
  //       ref?.current?.editor?.deleteText(limit, event?.length())
  //     }
  //   })
  // }, [])

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ align: [] }, { indent: '-1' }, { indent: '+1' }],
      [{ list: 'bullet' }, { list: 'ordered' }],
    ],
  }

  const formats = [
    'undo',
    'redo',
    'align',
    'indent',
    'list',
    'bold',
    'italic',
    'underline',
  ]

  useEffect(() => {
    const textLength = ref?.current?.unprivilegedEditor?.getText().length - 1
    setCount(() => textLength)
  }, [value])

  return (
    <div>
      <ReactQuill
        readOnly={readOnly}
        value={value}
        onKeyDown={characterCount}
        onChange={onChange}
        theme='snow'
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        // forwardedRef={ref}
        // maxLength={maxLength}
        className='overflow-y mb-[3rem] h-[15rem] text-black'
      />
      {/* <ErrorMessage /> */}
      <div className='text-graniteGray flex justify-between px-4'>
        <p className=''>{maxChara}</p>
        <p className=''>
          {/* {Number(truncateHtmlTags?.length - 1 || '0')}/{maxLength} */}
          {/* {count || '0'}/{maxLength} */}
          {/* {removeTags(value)?.length || '0'}/{maxLength} */}
        </p>
      </div>
    </div>
  )
}

export default CharacterCountQuill
