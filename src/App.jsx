import { useState } from 'react'

function App() {
  const [bin, setBin] = useState('')
  const [format, setFormat] = useState('PIPE')
  const [expiryMonth, setExpiryMonth] = useState('Random')
  const [expiryYear, setExpiryYear] = useState('Random')
  const [cvvOption, setCvvOption] = useState('random')
  const [quantity, setQuantity] = useState(10)
  const [cards, setCards] = useState([])
  const [copied, setCopied] = useState(false)
  const [dateEnabled, setDateEnabled] = useState(true)
  const [cvvEnabled, setCvvEnabled] = useState(true)

  const generateRandomDigits = (length) => {
    let result = ''
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10)
    }
    return result
  }

  const generateRandomExpiry = () => {
    const month = expiryMonth === 'Random' 
      ? String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
      : expiryMonth
    const year = expiryYear === 'Random'
      ? String(Math.floor(Math.random() * 10) + 25).padStart(2, '0')
      : expiryYear
    return `${month}|${year}`
  }

  const generateCVV = () => {
    if (cvvOption === 'blank') return ''
    return String(Math.floor(Math.random() * 900) + 100)
  }

  const handleGenerate = () => {
    if (bin.length !== 6 || !/^\d+$/.test(bin)) {
      alert('BIN phải là 6 chữ số')
      return
    }

    const newCards = []
    for (let i = 0; i < quantity; i++) {
      const randomDigits = generateRandomDigits(10)
      const cardNumber = `${bin}${randomDigits}`
      const expiry = dateEnabled ? generateRandomExpiry() : ''
      const cvv = cvvEnabled ? generateCVV() : ''
      
      let fullString = cardNumber
      if (dateEnabled && expiry) fullString += `|${expiry}`
      if (cvvEnabled && cvv) fullString += `|${cvv}`
      
      newCards.push({
        id: Date.now() + i,
        cardNumber,
        expiry,
        cvv,
        fullString
      })
    }
    
    setCards(newCards)
    setCopied(false)
  }

  const handleCopy = () => {
    const text = cards.map(card => card.fullString).join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleReset = () => {
    setCards([])
    setCopied(false)
  }

  const months = ['Random', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  const years = ['Random', ...Array.from({ length: 10 }, (_, i) => String(2025 + i))]

  return (
    <div className="min-h-screen bg-[#0f1419] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Controls */}
          <div className="bg-[#1a1f2e] rounded-xl p-6 border border-gray-700">
            {/* BIN Input */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase">
                BIN
              </label>
              <input
                type="text"
                maxLength="16"
                value={bin}
                onChange={(e) => setBin(e.target.value.replace(/\D/g, ''))}
                placeholder="552461xxxxxxxxxx"
                className="w-full px-4 py-3 bg-[#0f1419] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition"
              />
            </div>

            {/* Format */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase">
                FORMAT
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f1419] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-teal-500 transition appearance-none cursor-pointer"
              >
                <option value="PIPE">PIPE</option>
                <option value="CSV">CSV</option>
                <option value="JSON">JSON</option>
              </select>
            </div>

            {/* Date Toggle and Expiry */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setDateEnabled(!dateEnabled)}
                className={`flex items-center justify-center w-10 h-6 rounded-full transition ${
                  dateEnabled ? 'bg-teal-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition transform ${
                  dateEnabled ? 'translate-x-2' : '-translate-x-2'
                }`} />
              </button>
              <span className="text-sm text-gray-300 uppercase font-medium">DATE</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase">
                  Expiration Month
                </label>
                <select
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value)}
                  disabled={!dateEnabled}
                  className="w-full px-4 py-3 bg-[#0f1419] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-teal-500 transition appearance-none cursor-pointer disabled:opacity-50"
                >
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase">
                  Expiration Year
                </label>
                <select
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value)}
                  disabled={!dateEnabled}
                  className="w-full px-4 py-3 bg-[#0f1419] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-teal-500 transition appearance-none cursor-pointer disabled:opacity-50"
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {/* CVV Toggle and Option */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setCvvEnabled(!cvvEnabled)}
                className={`flex items-center justify-center w-10 h-6 rounded-full transition ${
                  cvvEnabled ? 'bg-teal-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition transform ${
                  cvvEnabled ? 'translate-x-2' : '-translate-x-2'
                }`} />
              </button>
              <span className="text-sm text-gray-300 uppercase font-medium">CVV</span>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase">
                CVV
              </label>
              <select
                value={cvvOption}
                onChange={(e) => setCvvOption(e.target.value)}
                disabled={!cvvEnabled}
                className="w-full px-4 py-3 bg-[#0f1419] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-teal-500 transition appearance-none cursor-pointer disabled:opacity-50"
              >
                <option value="blank">Leave blank to randomize</option>
                <option value="random">Random</option>
              </select>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase">
                QUANTITY
              </label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-[#0f1419] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-teal-500 transition appearance-none cursor-pointer"
              >
                {[10, 20, 50, 100].map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <span className="text-lg">⚙</span>
              Generate
            </button>
          </div>

          {/* Right Panel - Results */}
          <div className="bg-[#1a1f2e] rounded-xl p-6 border border-gray-700 flex flex-col">
            <div className="flex-1 bg-[#0f1419] rounded-lg p-4 mb-4 overflow-y-auto max-h-[600px] font-mono text-sm">
              {cards.length > 0 ? (
                <div className="space-y-1">
                  {cards.map((card) => (
                    <div key={card.id} className="text-gray-300">
                      {card.fullString}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-20">
                  Nhấn Generate để tạo dữ liệu test
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                disabled={cards.length === 0}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleReset}
                disabled={cards.length === 0}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
