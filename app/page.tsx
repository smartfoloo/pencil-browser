"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, X, Plus, Share, Bookmark, Settings, Layers } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function Browser() {
  const [url, setUrl] = useState("https://news.ycombinator.com")
  const [tabs, setTabs] = useState([{ id: 1, url: "https://news.ycombinator.com", title: "Hacker News" }])
  const [activeTab, setActiveTab] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showTabs, setShowTabs] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Update the current tab's URL
    setTabs(tabs.map((tab) => (tab.id === activeTab ? { ...tab, url } : tab)))

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const addNewTab = () => {
    const newId = Math.max(...tabs.map((t) => t.id), 0) + 1
    const newTab = { id: newId, url: "https://google.com", title: "New Tab" }
    setTabs([...tabs, newTab])
    setActiveTab(newId)
    setUrl("https://google.com")
    setShowTabs(false)
  }

  const closeTab = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (tabs.length === 1) {
      // Don't close the last tab, just reset it
      setTabs([{ id: 1, url: "https://google.com", title: "New Tab" }])
      setActiveTab(1)
      setUrl("https://google.com")
    } else {
      const newTabs = tabs.filter((tab) => tab.id !== id)
      setTabs(newTabs)
      // If we closed the active tab, activate the last tab
      if (activeTab === id) {
        setActiveTab(newTabs[newTabs.length - 1].id)
        setUrl(newTabs[newTabs.length - 1].url)
      }
    }
  }

  const switchTab = (id: number) => {
    setActiveTab(id)
    const tab = tabs.find((t) => t.id === id)
    if (tab) {
      setUrl(tab.url)
    }
    setShowTabs(false)
  }

  const goBack = () => {
    if (iframeRef.current) {
      // This would work in a real browser but not in our iframe setup
      // Just simulating the behavior
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  }

  const goForward = () => {
    if (iframeRef.current) {
      // This would work in a real browser but not in our iframe setup
      // Just simulating the behavior
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  }

  // Get the current tab
  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0]

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* Status bar */}
      <div className="bg-white px-4 py-2 flex items-center justify-between text-xs text-gray-500">
        <span>9:41</span>
        <div className="flex items-center space-x-1">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Browser chrome */}
      <div className="bg-white px-4 py-2 flex items-center space-x-2 border-b border-gray-200">
        <button onClick={goBack} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronLeft size={20} className="text-gray-500" />
        </button>

        <button onClick={goForward} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronRight size={20} className="text-gray-500" />
        </button>

        <form onSubmit={handleNavigate} className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-gray-100 py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search or enter website name"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </form>

        <button
          onClick={() => setShowTabs(!showTabs)}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors relative"
        >
          <Layers size={20} className="text-gray-500" />
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {tabs.length}
          </span>
        </button>
      </div>

      {/* Browser content */}
      <div className="flex-1 bg-white overflow-hidden">
        <iframe
          ref={iframeRef}
          src={currentTab.url}
          className="w-full h-full border-none"
          title="Browser Content"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>

      {/* Tab switcher */}
      <AnimatePresence>
        {showTabs && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 bg-black bg-opacity-80 z-10 p-4 overflow-y-auto"
          >
            <div className="grid grid-cols-2 gap-4 mt-12">
              {tabs.map((tab) => (
                <motion.div
                  key={tab.id}
                  layoutId={`tab-${tab.id}`}
                  onClick={() => switchTab(tab.id)}
                  className={cn(
                    "bg-white rounded-xl overflow-hidden shadow-lg border-2",
                    activeTab === tab.id ? "border-blue-500" : "border-transparent",
                  )}
                >
                  <div className="p-2 bg-gray-100 flex items-center justify-between">
                    <span className="text-xs truncate">{tab.title}</span>
                    <button onClick={(e) => closeTab(tab.id, e)} className="p-1 rounded-full hover:bg-gray-200">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="h-32 bg-white flex items-center justify-center text-gray-400">
                    <span className="text-xs">{tab.url}</span>
                  </div>
                </motion.div>
              ))}

              <motion.div
                onClick={addNewTab}
                className="bg-gray-100 rounded-xl overflow-hidden shadow border-2 border-dashed border-gray-300 flex items-center justify-center h-[calc(32px+2rem)]"
              >
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Plus size={24} />
                  <span className="text-xs mt-1">New Tab</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom toolbar */}
      <div className="bg-white px-4 py-3 flex items-center justify-around border-t border-gray-200">
        <button className="flex flex-col items-center">
          <Share size={20} className="text-gray-500" />
          <span className="text-xs mt-1 text-gray-500">Share</span>
        </button>

        <button className="flex flex-col items-center">
          <Bookmark size={20} className="text-gray-500" />
          <span className="text-xs mt-1 text-gray-500">Bookmarks</span>
        </button>

        <button onClick={addNewTab} className="flex flex-col items-center">
          <Plus size={20} className="text-gray-500" />
          <span className="text-xs mt-1 text-gray-500">New Tab</span>
        </button>

        <button className="flex flex-col items-center">
          <Settings size={20} className="text-gray-500" />
          <span className="text-xs mt-1 text-gray-500">Settings</span>
        </button>
      </div>
    </div>
  )
}
