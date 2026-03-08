import { useState } from 'react'
import { Sparkles, Loader2, RefreshCw, Copy, Check } from 'lucide-react'
import { useGenerateTips, useClearTips } from '../hooks/useAITips'
import toast from 'react-hot-toast'

function AITipsPanel({ applicationId, jobTitle, company, existingTips }) {
  const [activeTab, setActiveTab] = useState('keywords')
  const [tips, setTips] = useState(() => {
    try {
      return existingTips ? JSON.parse(existingTips) : null
    } catch {
      return null
    }
  })
  const [copied, setCopied] = useState(false)

  const { mutate: generateTips, isPending: isGenerating } = useGenerateTips(applicationId)
  const { mutate: clearTips } = useClearTips(applicationId)

  const handleGenerate = () => {
    generateTips(undefined, {
      onSuccess: (data) => {
        if (data.error) {
          toast.error(data.error)
        } else {
          setTips(data)
          toast.success('AI tips generated successfully!')
        }
      },
      onError: () => {
        toast.error('Failed to generate tips')
      }
    })
  }

  const handleRegenerate = () => {
    clearTips(undefined, {
      onSuccess: () => {
        setTips(null)
        handleGenerate()
      }
    })
  }

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className={`w-6 h-6 text-purple-600 ${isGenerating ? 'animate-pulse' : ''}`} />
          <h3 className="text-lg font-semibold text-gray-900">AI Resume Tips</h3>
        </div>
        {tips && !isGenerating && (
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </button>
        )}
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-600">Analyzing job posting...</p>
          <p className="text-sm text-gray-500 mt-1">This may take a few seconds</p>
        </div>
      )}

      {/* Empty State */}
      {!tips && !isGenerating && (
        <div className="text-center py-8">
          <p className="text-gray-600 text-sm mb-4">
            Click Generate to get personalized resume tips, keywords, and interview prep for this role
          </p>
          <button
            onClick={handleGenerate}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            Generate AI Tips
          </button>
        </div>
      )}

      {/* Tips Content */}
      {tips && !isGenerating && (
        <>
          {/* Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('keywords')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'keywords'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Keywords
            </button>
            <button
              onClick={() => setActiveTab('resume')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'resume'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Resume Tips
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'interview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Interview Prep
            </button>
            <button
              onClick={() => setActiveTab('cover')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'cover'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Cover Letter
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-3">
            {/* Keywords Tab */}
            {activeTab === 'keywords' && tips.keywords && (
              <div className="flex flex-wrap gap-2">
                {tips.keywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}

            {/* Resume Tips Tab */}
            {activeTab === 'resume' && tips.resume_tips && (
              <div className="space-y-2">
                {tips.resume_tips.map((tip, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {i + 1}
                      </span>
                      <p className="text-gray-700 text-sm">{tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Interview Prep Tab */}
            {activeTab === 'interview' && tips.interview_questions && (
              <div className="space-y-2">
                {tips.interview_questions.map((question, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold text-sm flex-shrink-0">Q{i + 1}:</span>
                      <p className="text-gray-700 text-sm">{question}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Cover Letter Tab */}
            {activeTab === 'cover' && tips.cover_letter_opener && (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-semibold text-gray-800">Opening Paragraph</h4>
                  <button
                    onClick={() => handleCopyToClipboard(tips.cover_letter_opener)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{tips.cover_letter_opener}</p>
              </div>
            )}
          </div>

          {/* Skills to Highlight */}
          {tips.skills_to_highlight && tips.skills_to_highlight.length > 0 && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Skills to Highlight</h4>
              <div className="flex flex-wrap gap-2">
                {tips.skills_to_highlight.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AITipsPanel
