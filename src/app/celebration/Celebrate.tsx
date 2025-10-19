'use client'

import React, { useState, useEffect, useCallback, CSSProperties } from 'react'

export default function WomensDayCard() {
  const [popup, setPopup] = useState({ show: false, img: '', text: '' })
  const [centerText, setCenterText] = useState(
    'Ngày Phụ nữ Việt Nam\nMong bạn luôn rạng rỡ như những bó hoa! Chạm vào những gì đang rơi xuống nha :]]',
  )
  const [fallingLetters, setFallingLetters] = useState([])
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [audioStarted, setAudioStarted] = useState(false)

  const messages = [
    {
      img: './assets/a1.jpg', //Thay ảnh
      text: 'Chúc bạn luôn vui vẻ, xinh đẹp và ngập tràn yêu thương!', //Thay lời nhắn
    },
    {
      img: './assets/a2.jpg',
      text: 'Mỗi ngày của bạn đều là một đoá hoa nở rộ.',
    },
    {
      img: './assets/a3.jpg',
      text: 'Mong từ nay bạn sẽ luôn nở nụ cười ở trên môi thay vì lau đi nước mắt đêm khuya!',
    },
    {
      img: './assets/a4.jpg',
      text: 'Chúc bạn một ngày 20/10 thật hạnh phúc và trọn vẹn! ',
    },
    {
      img: './assets/a5.jpg',
      text: 'Mong những điều tích cực sẽ luôn tới với bạn! ',
    },
  ]

  const letterEmojis = ['💌', '🎁', '🌸', '🌺', '💐', '🌹']

  const createHeartExplosion = useCallback((x: any, y: any, id: any) => {
    const hearts = ['💗']
    const numHearts = 12
    const heartElements = []

    for (let i = 0; i < numHearts; i++) {
      const angle = ((Math.PI * 2) / numHearts) * i
      const distance = Math.random() * 80 + 40

      heartElements.push({
        id: `heart-${id}-${i}`,
        emoji: hearts[0],
        x,
        y,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        size: Math.random() * 10 + 20,
      })
    }

    return heartElements
  }, [])

  const [hearts, setHearts] = useState<any[]>([])

  const handleLetterClick = useCallback(
    (e: any, letterId: any) => {
      e.stopPropagation()

      const rect = e.currentTarget.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2

      const newHearts = createHeartExplosion(x, y, letterId)
      setHearts((prev) => [...prev, ...newHearts])

      setTimeout(() => {
        setHearts((prev) =>
          prev.filter((h) => !h.id.startsWith(`heart-${letterId}`)),
        )
      }, 2000)

      setFallingLetters((prev) => prev.filter((l: any) => l.id !== letterId))

      setTimeout(() => {
        const message = messages[currentMessageIndex]
        setPopup({ show: true, img: message.img, text: message.text })
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
      }, 300)
    },
    [currentMessageIndex, messages, createHeartExplosion],
  )

  const createFallingLetter = useCallback(() => {
    const newLetter = {
      id: Date.now() + Math.random(),
      emoji: letterEmojis[Math.floor(Math.random() * letterEmojis.length)],
      left: Math.random() * (window.innerWidth - 50),
      animationDuration: 8 + Math.random() * 2,
    }
    // @ts-ignore
    setFallingLetters((prev: any) => [...prev, newLetter] as any[])

    setTimeout(() => {
      setFallingLetters((prev) =>
        prev.filter((l: any) => l.id !== newLetter.id),
      )
    }, (newLetter.animationDuration + 1) * 1000)
  }, [letterEmojis])

  useEffect(() => {
    const interval = setInterval(createFallingLetter, 1000)
    return () => clearInterval(interval)
  }, [createFallingLetter])

  const closePopup = () => {
    setCenterText(popup.text)
    setPopup({ show: false, img: '', text: '' })
  }

  const handleBodyClick = () => {
    if (!audioStarted) {
      setAudioStarted(true)
    }
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50 font-['Mali',cursive]"
      onClick={handleBodyClick}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mali:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');
        
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes popupShow {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5) rotate(-5deg);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
          }
        }
        
        @keyframes fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 1;
          }
          20% {
            transform: translateY(20vh) translateX(-20px) rotate(-10deg);
          }
          40% {
            transform: translateY(40vh) translateX(15px) rotate(8deg);
          }
          60% {
            transform: translateY(60vh) translateX(-15px) rotate(-6deg);
          }
          80% {
            transform: translateY(80vh) translateX(10px) rotate(4deg);
          }
          100% {
            transform: translateY(100vh) translateX(0) rotate(0deg);
            opacity: 0.3;
          }
        }
        
        @keyframes letterClick {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.3) rotate(360deg); }
          100% { transform: scale(0) rotate(720deg); }
        }
        
        @keyframes explode {
          0% {
            transform: translate(-50%, -50%) translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(1.5);
            opacity: 0;
          }
        }
        
        .animate-pulse-custom {
          animation: pulse 3s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        
        .animate-popup {
          animation: popupShow 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        
        .animate-fall {
          animation: fall linear forwards;
        }
        
        .animate-heart-explode {
          animation: explode 2s ease-out forwards;
        }
      `}</style>

      {/* Center Message */}
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 bg-gradient-to-br from-white/95 to-pink-50/90 px-8 md:px-12 py-8 md:py-10 rounded-3xl text-xl md:text-2xl text-pink-700 text-center shadow-[0_20px_60px_rgba(216,27,96,0.3),0_0_0_1px_rgba(255,255,255,0.5)_inset] z-10 max-w-[90%] animate-pulse-custom backdrop-blur-sm border-2 border-white/30">
        <strong className="block text-2xl md:text-3xl mb-4 font-bold bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600 bg-clip-text text-transparent animate-gradient">
          Chúc mừng 20-10
        </strong>
        <span className="whitespace-pre-line text-base md:text-xl font-medium">
          {centerText}
        </span>
      </div>

      {/* Falling Letters */}
      {fallingLetters.map((letter: any) => (
        <div
          key={letter.id}
          className="absolute -top-24 text-5xl md:text-6xl cursor-pointer select-none z-[2] transition-transform duration-300 hover:scale-125 hover:rotate-12 animate-fall"
          style={{
            left: `${letter.left}px`,
            animationDuration: `${letter.animationDuration}s`,
            filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.2))',
          }}
          onClick={(e) => handleLetterClick(e, letter.id)}
        >
          {letter.emoji}
        </div>
      ))}

      {/* Hearts Explosion */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="fixed pointer-events-none select-none animate-heart-explode"
          style={
            {
              left: `${heart.x}px`,
              top: `${heart.y}px`,
              fontSize: `${heart.size}px`,
              '--dx': `${heart.dx}px`,
              '--dy': `${heart.dy}px`,
            } as CSSProperties
          }
        >
          {heart.emoji}
        </div>
      ))}

      {/* Popup Overlay */}
      {popup.show && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99]"
            onClick={closePopup}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-white to-pink-50 rounded-3xl shadow-[0_25px_80px_rgba(216,27,96,0.4)] p-6 md:p-8 text-center z-[100] w-[90%] max-w-md animate-popup border-3 border-white/80">
            <div className="mt-5">
              <img
                src={popup.img}
                alt="Lời chúc"
                className="w-full rounded-2xl mb-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)] border-3 border-white"
              />
              <p className="text-base md:text-lg text-pink-700 leading-relaxed mb-5 font-medium">
                {popup.text}
              </p>
              <button
                onClick={closePopup}
                className="mt-2 bg-gradient-to-r from-pink-600 to-pink-400 text-white border-none px-8 py-3 rounded-full cursor-pointer text-base font-semibold shadow-[0_5px_20px_rgba(216,27,96,0.4)] transition-all duration-300 hover:from-pink-700 hover:to-pink-500 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(216,27,96,0.5)] active:translate-y-0"
              >
                Đóng
              </button>
            </div>
          </div>
        </>
      )}

      {/* Bottom GIF */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-32 md:w-40 max-w-[40vw] z-10 pointer-events-none">
        <div className="text-7xl md:text-8xl">🌸</div>
      </div>
    </div>
  )
}
