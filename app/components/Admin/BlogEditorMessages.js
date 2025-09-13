import { AlertTriangle, CircleCheck, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

const BlogEditorMessages = ({ successMessage, errorMessage, onClearMessages }) => {
    return (
        <AnimatePresence>
            {successMessage && (
                <motion.div
                    className="container mx-auto px-4 mt-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center text-green-700">
                        <CircleCheck className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                        <span>{successMessage}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto text-green-700 hover:bg-green-100 p-1 h-auto"
                            onClick={onClearMessages}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </motion.div>
            )}

            {errorMessage && (
                <motion.div
                    className="container mx-auto px-4 mt-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center text-red-700">
                        <AlertTriangle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" />
                        <span>{errorMessage}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto text-red-700 hover:bg-red-100 p-1 h-auto"
                            onClick={onClearMessages}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default BlogEditorMessages
