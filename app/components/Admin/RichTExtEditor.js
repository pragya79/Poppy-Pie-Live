"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImageIcon,
  LinkIcon,
  Undo,
  Redo,
  Code,
  Unlink,
  Underline,
  Strikethrough,
  X,
  CheckSquare,
  Type,
  Eye,
  FileImage,
  Maximize2,
  Minimize2,
  TextQuote,
  Palette,
  Highlighter,
  Subscript,
  Superscript,
  Indent,
  Outdent,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

/**
 * Rich Text Editor Component
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Initial editor content
 * @param {Function} props.onChange - Callback when content changes
 * @param {string} props.placeholder - Placeholder text when editor is empty
 * @param {string} props.minHeight - Minimum height of editor
 * @param {string} props.maxHeight - Maximum height of editor
 * @param {boolean} props.autoFocus - Whether to focus editor on mount
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.direction - Text direction ('ltr' or 'rtl')
 * @returns {JSX.Element} Rich Text Editor component
 */
const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Start writing...",
  minHeight = "300px",
  maxHeight = "600px",
  autoFocus = false,
  className = "",
  direction = "ltr", // Default to left-to-right
}) => {
  const editorRef = useRef(null)
  const [editorValue, setEditorValue] = useState(value || "")
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [imageTitle, setImageTitle] = useState("")
  const [imageWidth, setImageWidth] = useState("")
  const [imageHeight, setImageHeight] = useState("")
  const fileInputRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showHtml, setShowHtml] = useState(false)
  const [htmlContent, setHtmlContent] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [isPreview, setIsPreview] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [textHistory, setTextHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    h1: false,
    h2: false,
    h3: false,
    ul: false,
    ol: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
    subscript: false,
    superscript: false,
  })

  // Memoized function to update counts
  const updateCounts = useCallback((text) => {
    if (!text) {
      setWordCount(0)
      setCharCount(0)
      return
    }

    // Remove HTML tags for accurate counting
    const plainText = text
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
    setCharCount(plainText.length)
    setWordCount(plainText === "" ? 0 : plainText.split(/\s+/).length)
  }, [])

  // Sync the editor content with parent component
  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      if (typeof value === "string") {
        editorRef.current.innerHTML = value
        setEditorValue(value)
        updateCounts(value)
      }
    }
  }, [value, updateCounts])

  // Auto focus on editor when component mounts
  useEffect(() => {
    if (autoFocus && editorRef.current) {
      editorRef.current.focus()
    }
  }, [autoFocus])

  // Set the text direction and initialize editor
  useEffect(() => {
    if (editorRef.current) {
      // Set text direction explicitly
      editorRef.current.dir = direction

      // Initialize history if empty
      if (textHistory.length === 0 && editorRef.current.innerHTML) {
        setTextHistory([editorRef.current.innerHTML])
        setHistoryIndex(0)
      }
    }
  }, [direction, textHistory.length])

  // Monitor selection changes to update active format buttons
  useEffect(() => {
    const checkActiveFormats = () => {
      if (!editorRef.current) return

      const formats = {
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        strikethrough: document.queryCommandState("strikethrough"),
        h1: document.queryCommandValue("formatBlock") === "h1",
        h2: document.queryCommandValue("formatBlock") === "h2",
        h3: document.queryCommandValue("formatBlock") === "h3",
        ul: document.queryCommandState("insertUnorderedList"),
        ol: document.queryCommandState("insertOrderedList"),
        alignLeft: document.queryCommandState("justifyLeft"),
        alignCenter: document.queryCommandState("justifyCenter"),
        alignRight: document.queryCommandState("justifyRight"),
        subscript: document.queryCommandState("subscript"),
        superscript: document.queryCommandState("superscript"),
      }

      setActiveFormats(formats)
    }

    document.addEventListener("selectionchange", checkActiveFormats)

    return () => {
      document.removeEventListener("selectionchange", checkActiveFormats)
    }
  }, [])

  // Add to history for undo/redo
  const addToHistory = useCallback((content) => {
    // If we're not at the end of the history, truncate it
    if (historyIndex < textHistory.length - 1) {
      setTextHistory(prevHistory => prevHistory.slice(0, historyIndex + 1))
    }

    // Add new state to history (but avoid duplicates)
    setTextHistory(prevHistory => {
      const lastEntry = prevHistory[prevHistory.length - 1]
      if (lastEntry === content) return prevHistory
      return [...prevHistory, content]
    })

    setHistoryIndex(prevIndex => prevIndex + 1)
  }, [historyIndex, textHistory])

  // Handle editor content changes
  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      setEditorValue(content)
      setHtmlContent(content)
      updateCounts(content)

      // Only add to history if content actually changed and after a small delay to batch changes
      if (content !== textHistory[historyIndex]) {
        // Debounce history updates to avoid too many entries
        const timeout = setTimeout(() => {
          addToHistory(content)
        }, 500)

        return () => clearTimeout(timeout)
      }

      if (onChange) {
        onChange(content)
      }
    }
  }, [addToHistory, historyIndex, onChange, textHistory, updateCounts])

  // Format commands
  const execCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value)
    handleContentChange()
    editorRef.current?.focus()
  }, [handleContentChange])

  // Custom undo/redo using our history
  const customUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prevIndex => prevIndex - 1)
      const prevContent = textHistory[historyIndex - 1]

      if (editorRef.current) {
        editorRef.current.innerHTML = prevContent
        setEditorValue(prevContent)
        setHtmlContent(prevContent)
        updateCounts(prevContent)

        if (onChange) {
          onChange(prevContent)
        }
      }
    }
  }, [historyIndex, onChange, textHistory, updateCounts])

  const customRedo = useCallback(() => {
    if (historyIndex < textHistory.length - 1) {
      setHistoryIndex(prevIndex => prevIndex + 1)
      const nextContent = textHistory[historyIndex + 1]

      if (editorRef.current) {
        editorRef.current.innerHTML = nextContent
        setEditorValue(nextContent)
        setHtmlContent(nextContent)
        updateCounts(nextContent)

        if (onChange) {
          onChange(nextContent)
        }
      }
    }
  }, [historyIndex, onChange, textHistory, updateCounts])

  // Formatting functions
  const formatBold = () => execCommand("bold")
  const formatItalic = () => execCommand("italic")
  const formatUnderline = () => execCommand("underline")
  const formatStrikethrough = () => execCommand("strikethrough")
  const formatBulletList = () => execCommand("insertUnorderedList")
  const formatNumberList = () => execCommand("insertOrderedList")
  const formatH1 = () => execCommand("formatBlock", "<h1>")
  const formatH2 = () => execCommand("formatBlock", "<h2>")
  const formatH3 = () => execCommand("formatBlock", "<h3>")
  const formatParagraph = () => execCommand("formatBlock", "<p>")
  const formatAlignLeft = () => execCommand("justifyLeft")
  const formatAlignCenter = () => execCommand("justifyCenter")
  const formatAlignRight = () => execCommand("justifyRight")
  const formatUndo = () => customUndo()
  const formatRedo = () => customRedo()
  const formatBlockquote = () => execCommand("formatBlock", "<blockquote>")
  const formatCode = () => execCommand("formatBlock", "<pre>")
  const formatClear = () => execCommand("removeFormat")
  const formatUnlink = () => execCommand("unlink")
  const formatInsertCheckbox = () => execCommand("insertHTML", '<input type="checkbox" />')
  const formatSubscript = () => execCommand("subscript")
  const formatSuperscript = () => execCommand("superscript")
  const formatIndent = () => execCommand("indent")
  const formatOutdent = () => execCommand("outdent")

  // Text color and highlight
  const formatTextColor = (color) => execCommand("foreColor", color)
  const formatHighlight = (color) => execCommand("hiliteColor", color)

  // Handle link insertion
  const insertLink = () => {
    const selection = window.getSelection()
    if (selection.toString().length === 0) {
      alert("Please select text to create a link")
      return
    }

    const url = prompt("Enter URL:", "https://")
    if (url) {
      execCommand("createLink", url)
    }
  }

  // Handle image dialog
  const handleImageClick = () => {
    setShowImageDialog(true)
  }

  // Handle HTML view toggle
  const toggleHtmlView = () => {
    if (!showHtml) {
      setHtmlContent(editorRef.current?.innerHTML || "")
    } else {
      if (editorRef.current) {
        editorRef.current.innerHTML = htmlContent
        handleContentChange()
      }
    }
    setShowHtml(!showHtml)
  }

  // Handle preview mode
  const togglePreview = () => {
    setIsPreview(!isPreview)
  }

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Handle image URL input change
  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value)
  }

  // Handle image alt text change
  const handleImageAltChange = (e) => {
    setImageAlt(e.target.value)
  }

  // Handle image title change
  const handleImageTitleChange = (e) => {
    setImageTitle(e.target.value)
  }

  // Handle image width change
  const handleImageWidthChange = (e) => {
    setImageWidth(e.target.value)
  }

  // Handle image height change
  const handleImageHeightChange = (e) => {
    setImageHeight(e.target.value)
  }

  // Handle HTML content change
  const handleHtmlChange = (e) => {
    setHtmlContent(e.target.value)
  }

  // Insert image from URL
  const insertImageFromUrl = () => {
    if (imageUrl.trim()) {
      let imgHtml = `<img src="${imageUrl}" `

      if (imageAlt) imgHtml += `alt="${imageAlt}" `
      if (imageTitle) imgHtml += `title="${imageTitle}" `
      if (imageWidth) imgHtml += `width="${imageWidth}" `
      if (imageHeight) imgHtml += `height="${imageHeight}" `

      imgHtml += 'style="max-width: 100%;" />'

      execCommand("insertHTML", imgHtml)
      resetImageDialog()
    }
  }

  // Reset image dialog fields
  const resetImageDialog = () => {
    setImageUrl("")
    setImageAlt("")
    setImageTitle("")
    setImageWidth("")
    setImageHeight("")
    setSelectedImage(null)
    setUploadProgress(0)
    setIsUploading(false)
    setUploadError("")
    setShowImageDialog(false)
  }

  // Handle file selection for image upload
  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    handleFileSelection(file)
  }

  // Handle file selection
  const handleFileSelection = (file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setUploadError("File size exceeds 5MB. Please choose a smaller image.")
        return
      }

      setSelectedImage(file)
      setUploadError("")

      // Preview the image
      const reader = new FileReader()
      reader.onload = (event) => {
        setImageUrl(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle file upload
  const handleFileUpload = () => {
    if (!selectedImage) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // In a real app, you would upload to your server or a service like Cloudinary
    // For this example, we'll just use the local file reader result
    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress(100)
      setIsUploading(false)

      // Insert the image
      let imgHtml = `<img src="${imageUrl}" `

      if (imageAlt) imgHtml += `alt="${imageAlt}" `
      if (imageTitle) imgHtml += `title="${imageTitle}" `
      if (imageWidth) imgHtml += `width="${imageWidth}" `
      if (imageHeight) imgHtml += `height="${imageHeight}" `

      imgHtml += 'style="max-width: 100%;" />'

      execCommand("insertHTML", imgHtml)
      resetImageDialog()
    }, 2000)
  }

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0])
    }
  }

  // Handle keyboard events
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault()
      execCommand("insertHTML", "&nbsp;&nbsp;&nbsp;&nbsp;")
    }

    // Support ctrl+b, ctrl+i, ctrl+u, etc.
    if (e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault()
          formatBold()
          break
        case "i":
          e.preventDefault()
          formatItalic()
          break
        case "u":
          e.preventDefault()
          formatUnderline()
          break
        case "z":
          e.preventDefault()
          if (e.shiftKey) {
            formatRedo()
          } else {
            formatUndo()
          }
          break
        case "y":
          e.preventDefault()
          formatRedo()
          break
        case "k":
          e.preventDefault()
          insertLink()
          break
        default:
          break
      }
    }
  }

  // Save HTML content when in HTML view
  const saveHtmlContent = () => {
    if (showHtml && editorRef.current) {
      editorRef.current.innerHTML = htmlContent
      handleContentChange()
      setShowHtml(false)
    }
  }

  // Color options for text and highlighting
  const colorOptions = [
    { name: "Default", value: "" },
    { name: "Black", value: "#000000" },
    { name: "Gray", value: "#6b7280" },
    { name: "Red", value: "#ef4444" },
    { name: "Orange", value: "#f97316" },
    { name: "Yellow", value: "#eab308" },
    { name: "Green", value: "#22c55e" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#a855f7" },
    { name: "Pink", value: "#ec4899" },
  ]

  return (
    <div
      className={cn(
        "rich-text-editor border border-gray-300 rounded-md",
        isFullscreen ? "fixed inset-0 z-50 bg-white" : "",
        className,
      )}
      dir={direction} // Set text direction for the entire component
    >
      {/* Toolbar */}
      {!isPreview && (
        <div className="editor-toolbar flex flex-wrap gap-1 p-2 border-b border-gray-300 bg-gray-50">
          <TooltipProvider>
            {/* Text Formatting */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFormats.bold ? "default" : "ghost"}
                  size="sm"
                  onClick={formatBold}
                  title="Bold (Ctrl+B)"
                  className="h-8 w-8 p-0"
                >
                  <Bold size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bold (Ctrl+B)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFormats.italic ? "default" : "ghost"}
                  size="sm"
                  onClick={formatItalic}
                  title="Italic (Ctrl+I)"
                  className="h-8 w-8 p-0"
                >
                  <Italic size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Italic (Ctrl+I)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFormats.underline ? "default" : "ghost"}
                  size="sm"
                  onClick={formatUnderline}
                  title="Underline (Ctrl+U)"
                  className="h-8 w-8 p-0"
                >
                  <Underline size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Underline (Ctrl+U)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFormats.strikethrough ? "default" : "ghost"}
                  size="sm"
                  onClick={formatStrikethrough}
                  title="Strikethrough"
                  className="h-8 w-8 p-0"
                >
                  <Strikethrough size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Strikethrough</TooltipContent>
            </Tooltip>

            {/* Text Color */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Palette size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Text Color</TooltipContent>
              </Tooltip>
              <DropdownMenuContent>
                {colorOptions.map((color) => (
                  <DropdownMenuItem
                    key={color.value || "default"}
                    onClick={() => formatTextColor(color.value)}
                    className="flex items-center gap-2"
                  >
                    {color.value && <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }} />}
                    {color.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Highlight Color */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Highlighter size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Highlight</TooltipContent>
              </Tooltip>
              <DropdownMenuContent>
                {colorOptions.map((color) => (
                  <DropdownMenuItem
                    key={color.value || "default"}
                    onClick={() => formatHighlight(color.value)}
                    className="flex items-center gap-2"
                  >
                    {color.value && <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }} />}
                    {color.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-6 border-l border-gray-300 mx-1"></div>

            {/* Subscript/Superscript */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFormats.subscript ? "default" : "ghost"}
                  size="sm"
                  onClick={formatSubscript}
                  title="Subscript"
                  className="h-8 w-8 p-0"
                >
                  <Subscript size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Subscript</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFormats.superscript ? "default" : "ghost"}
                  size="sm"
                  onClick={formatSuperscript}
                  title="Superscript"
                  className="h-8 w-8 p-0"
                >
                  <Superscript size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Superscript</TooltipContent>
            </Tooltip>

            <div className="h-6 border-l border-gray-300 mx-1"></div>

            {/* Lists */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFormats.ul ? "default" : "ghost"}
                  size="sm"
                  onClick={formatBulletList}
                  title="Bullet List"
                  className="h-8 w-8 p-0"
                >
                  <List size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bullet List</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFormats.ol ? "default" : "ghost"}
                  size="sm"
                  onClick={formatNumberList}
                  title="Numbered List"
                  className="h-8 w-8 p-0"
                >
                  <ListOrdered size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Numbered List</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={formatInsertCheckbox}
                  title="Insert Checkbox"
                  className="h-8 w-8 p-0"
                >
                  <CheckSquare size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Checkbox</TooltipContent>
            </Tooltip>

            {/* Indentation */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={formatIndent} title="Indent" className="h-8 w-8 p-0">
                  <Indent size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Indent</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={formatOutdent} title="Outdent" className="h-8 w-8 p-0">
                  <Outdent size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Outdent</TooltipContent>
            </Tooltip>

            <div className="h-6 border-l border-gray-300 mx-1"></div>

            {/* Headings */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFormats.h1 ? "default" : "ghost"}
                  size="sm"
                  onClick={formatH1}
                  title="Heading 1"
                  className="h-8 w-8 p-0"
                >
                  <Heading1 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Heading 1</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFormats.h2 ? "default" : "ghost"}
                  size="sm"
                  onClick={formatH2}
                  title="Heading 2"
                  className="h-8 w-8 p-0"
                >
                  <Heading2 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Heading 2</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFormats.h3 ? "default" : "ghost"}
                  size="sm"
                  onClick={formatH3}
                  title="Heading 3"
                  className="h-8 w-8 p-0"
                >
                  <Heading3 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Heading 3</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={formatParagraph} title="Paragraph" className="h-8 w-8 p-0">
                  <Type size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Paragraph</TooltipContent>
            </Tooltip>

            <div className="h-6 border-l border-gray-300 mx-1"></div>

            {/* Text alignment */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFormats.alignLeft ? "default" : "ghost"}
                  size="sm"
                  onClick={formatAlignLeft}
                  title="Align Left"
                  className="h-8 w-8 p-0"
                >
                  <AlignLeft size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align Left</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFormats.alignCenter ? "default" : "ghost"}
                  size="sm"
                  onClick={formatAlignCenter}
                  title="Align Center"
                  className="h-8 w-8 p-0"
                >
                  <AlignCenter size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align Center</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFormats.alignRight ? "default" : "ghost"}
                  size="sm"
                  onClick={formatAlignRight}
                  title="Align Right"
                  className="h-8 w-8 p-0"
                >
                  <AlignRight size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align Right</TooltipContent>
            </Tooltip>

            <div className="h-6 border-l border-gray-300 mx-1"></div>

            {/* Special formatting */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={formatBlockquote} title="Blockquote" className="h-8 w-8 p-0">
                  <TextQuote size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Blockquote</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={formatCode} title="Code Block" className="h-8 w-8 p-0">
                  <Code size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Code Block</TooltipContent>
            </Tooltip>

            <div className="h-6 border-l border-gray-300 mx-1"></div>

            {/* Media */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleImageClick}
                  title="Insert Image"
                  className="h-8 w-8 p-0"
                >
                  <ImageIcon size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Image</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={insertLink}
                  title="Insert Link (Ctrl+K)"
                  className="h-8 w-8 p-0"
                >
                  <LinkIcon size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Link (Ctrl+K)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={formatUnlink} title="Remove Link" className="h-8 w-8 p-0">
                  <Unlink size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Remove Link</TooltipContent>
            </Tooltip>

            <div className="h-6 border-l border-gray-300 mx-1"></div>

            {/* Edit operations */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={formatUndo} title="Undo (Ctrl+Z)" className="h-8 w-8 p-0">
                  <Undo size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={formatRedo} title="Redo (Ctrl+Y)" className="h-8 w-8 p-0">
                  <Redo size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={formatClear}
                  title="Clear Formatting"
                  className="h-8 w-8 p-0"
                >
                  <X size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear Formatting</TooltipContent>
            </Tooltip>

            <div className="h-6 border-l border-gray-300 mx-1"></div>

            {/* View modes */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showHtml ? "default" : "ghost"}
                  size="sm"
                  onClick={toggleHtmlView}
                  title="HTML View"
                  className="h-8 w-8 p-0"
                >
                  <Code size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>HTML View</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isPreview ? "default" : "ghost"}
                  size="sm"
                  onClick={togglePreview}
                  title="Preview"
                  className="h-8 w-8 p-0"
                >
                  <Eye size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Preview</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  className="h-8 w-8 p-0 ml-auto"
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Editor Content */}
      {showHtml ? (
        <div className="p-4">
          <textarea
            value={htmlContent}
            onChange={handleHtmlChange}
            className="w-full h-[300px] p-2 border border-gray-300 rounded-md font-mono text-sm"
            dir={direction}
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={saveHtmlContent}>Apply HTML</Button>
          </div>
        </div>
      ) : isPreview ? (
        <div
          className="preview-content p-4 prose max-w-none overflow-y-auto"
          style={{ minHeight, maxHeight: isFullscreen ? "calc(100vh - 120px)" : maxHeight }}
          dangerouslySetInnerHTML={{ __html: editorValue }}
          dir={direction}
        ></div>
      ) : (
        <div
          ref={editorRef}
          className="editor-content p-4 overflow-y-auto focus:outline-none"
          style={{ minHeight, maxHeight: isFullscreen ? "calc(100vh - 120px)" : maxHeight }}
          contentEditable
          suppressContentEditableWarning
          onInput={handleContentChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          dangerouslySetInnerHTML={{ __html: editorValue }}
          dir={direction}
        ></div>
      )}

      {/* Footer with word/character count */}
      <div className="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
        <div>
          {wordCount} words | {charCount} characters
        </div>
        {isPreview && (
          <Button size="sm" variant="outline" onClick={togglePreview}>
            Exit Preview
          </Button>
        )}
      </div>

      {/* Image Upload Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
            <DialogDescription>Add an image from URL or upload from your device.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">Image URL</TabsTrigger>
              <TabsTrigger value="upload">Upload Image</TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image-alt">Alt Text</Label>
                  <Input
                    id="image-alt"
                    placeholder="Image description"
                    value={imageAlt}
                    onChange={handleImageAltChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-title">Title</Label>
                  <Input
                    id="image-title"
                    placeholder="Image title"
                    value={imageTitle}
                    onChange={handleImageTitleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image-width">Width (px)</Label>
                  <Input
                    id="image-width"
                    type="number"
                    placeholder="Width"
                    value={imageWidth}
                    onChange={handleImageWidthChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-height">Height (px)</Label>
                  <Input
                    id="image-height"
                    type="number"
                    placeholder="Height"
                    value={imageHeight}
                    onChange={handleImageHeightChange}
                  />
                </div>
              </div>

              {imageUrl && (
                <div className="mt-4 border rounded-md p-2">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="max-w-full max-h-[200px] object-contain mx-auto"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E"
                      e.target.alt = "Invalid image URL"
                    }}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="upload" className="space-y-4 py-4">
              <div
                className={cn(
                  "border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer",
                  dragActive && "border-primary bg-primary/5",
                )}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <FileImage className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 mb-2">
                  Drag and drop an image, or <span className="text-primary font-medium">browse</span>
                </p>
                <p className="text-xs text-gray-400">Max file size: 5MB</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {uploadError && <div className="text-sm text-red-500 mt-2">{uploadError}</div>}

              {selectedImage && (
                <div className="space-y-4">
                  <div className="border rounded-md p-2">
                    <p className="text-sm font-medium mb-2">Selected Image:</p>
                    <div className="flex items-center gap-2">
                      <img
                        src={imageUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="max-w-[100px] max-h-[100px] object-contain"
                      />
                      <div className="text-sm">
                        <p className="font-medium">{selectedImage.name}</p>
                        <p className="text-gray-500">{(selectedImage.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="upload-alt">Alt Text</Label>
                      <Input
                        id="upload-alt"
                        placeholder="Image description"
                        value={imageAlt}
                        onChange={handleImageAltChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upload-title">Title</Label>
                      <Input
                        id="upload-title"
                        placeholder="Image title"
                        value={imageTitle}
                        onChange={handleImageTitleChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="upload-width">Width (px)</Label>
                      <Input
                        id="upload-width"
                        type="number"
                        placeholder="Width"
                        value={imageWidth}
                        onChange={handleImageWidthChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upload-height">Height (px)</Label>
                      <Input
                        id="upload-height"
                        type="number"
                        placeholder="Height"
                        value={imageHeight}
                        onChange={handleImageHeightChange}
                      />
                    </div>
                  </div>

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="text-sm">Uploading... {uploadProgress}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={resetImageDialog}>
              Cancel
            </Button>

            {selectedImage ? (
              <Button onClick={handleFileUpload} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Insert Image"}
              </Button>
            ) : (
              <Button onClick={insertImageFromUrl} disabled={!imageUrl.trim()}>
                Insert Image
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RichTextEditor