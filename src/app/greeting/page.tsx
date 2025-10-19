'use client'

import { useState, useEffect, useRef } from 'react'

export default function WomenDayGreeting() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [centerText, setCenterText] = useState(
    'Ngày Phụ nữ Việt Nam<br />Mong bạn luôn rạng rỡ như những bó hoa! Chạm vào những gì đang rơi xuống nha :]',
  )
  const [fallingLetters, setFallingLetters] = useState<any[]>([])
  const [hearts, setHearts] = useState<any[]>([])
  const audioRef = useRef(null)
  const letterIdRef = useRef(0)
  const heartIdRef = useRef(0)

  const messages = [
    {
      img: './assets/a1.jpg',
      text: 'Chúc bạn luôn vui vẻ, xinh đẹp và ngập tràn yêu thương!',
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
      text: 'Chúc bạn một ngày 20/10 thật hạnh phúc và trọn vẹn!',
    },
    {
      img: './assets/a5.jpg',
      text: 'Mong những điều tích cực sẽ luôn tới với bạn!',
    },
  ]

  const letterImages = [
    './assets/letters.png',
    './assets/q3.png',
    './assets/h1.png',
    './assets/h3.png',
    './assets/t2.png',
    './assets/t5.png',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      createFallingLetter()
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const createFallingLetter = () => {
    const id = letterIdRef.current++
    const randomImage =
      letterImages[Math.floor(Math.random() * letterImages.length)]
    const left = Math.random() * (window.innerWidth - 50)

    setFallingLetters((prev: any[]) => [
      ...prev,
      { id, src: randomImage, left },
    ])

    setTimeout(() => {
      setFallingLetters((prev: any[]) =>
        prev.filter((letter: any) => letter.id !== id),
      )
    }, 8000)
  }

  const createHeartExplosion = (x: number, y: number) => {
    const numHearts = 12
    const newHearts: any[] = []

    for (let i = 0; i < numHearts; i++) {
      const id = heartIdRef.current++
      const angle = ((Math.PI * 2) / numHearts) * i
      const distance = Math.random() * 80 + 40
      const dx = Math.cos(angle) * distance
      const dy = Math.sin(angle) * distance
      const size = Math.random() * 10 + 20

      newHearts.push({ id, x, y, dx, dy, size })
    }

    setHearts((prev: any[]) => [...prev, ...newHearts])

    setTimeout(() => {
      setHearts((prev: any[]) =>
        prev.filter((heart) => !newHearts.find((h) => h.id === heart.id)),
      )
    }, 2000)
  }

  const handleLetterClick = (
    e: React.MouseEvent<HTMLImageElement>,
    letterId: number,
  ) => {
    createHeartExplosion(e.clientX, e.clientY)
    setFallingLetters((prev: any[]) =>
      prev.map((letter: any) =>
        letter.id === letterId ? { ...letter, clicked: true } : letter,
      ),
    )

    setTimeout(() => {
      handleShowPopup()
    }, 300)
  }

  const handleShowPopup = () => {
    setShowPopup(true)
  }

  const handleClosePopup = () => {
    const message = messages[currentMessageIndex]
    setCenterText(message.text)
    setCurrentMessageIndex((currentMessageIndex + 1) % messages.length)
    setShowPopup(false)
  }

  const playAudio = () => {
    if (audioRef.current && (audioRef.current as HTMLAudioElement).paused) {
      ;(audioRef.current as HTMLAudioElement).play()
    }
  }

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #fffafa)',
        fontFamily: "'Mali', cursive",
      }}
      onClick={playAudio}
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
        
        @keyframes fall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
          20% { transform: translateY(20vh) translateX(-20px) rotate(-10deg); }
          40% { transform: translateY(40vh) translateX(15px) rotate(8deg); }
          60% { transform: translateY(60vh) translateX(-15px) rotate(-6deg); }
          80% { transform: translateY(80vh) translateX(10px) rotate(4deg); }
          100% { transform: translateY(100vh) translateX(0) rotate(0deg); opacity: 0.3; }
        }
        
        @keyframes letterClick {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.3) rotate(360deg); }
          100% { transform: scale(0) rotate(720deg); }
        }
        
        @keyframes explode {
          0% { transform: translate(-50%, -50%) translate(0, 0); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(1.5); opacity: 0; }
        }
        
        @keyframes popupShow {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.5) rotate(-5deg); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
        }
        
        .pulse-animation {
          animation: pulse 3s ease-in-out infinite;
        }
        
        .gradient-text {
          background: linear-gradient(45deg, #d81b60, #f06292, #d81b60);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient 3s ease infinite;
        }
        
        .falling-letter {
          animation: fall 8s linear;
          filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.2));
          transition: transform 0.3s ease;
        }
        
        .falling-letter:hover {
          transform: scale(1.2) rotate(10deg);
          filter: drop-shadow(0 10px 20px rgba(216, 27, 96, 0.4));
        }
        
        .letter-clicked {
          animation: letterClick 0.6s ease-out forwards !important;
        }
        
        .heart {
          animation: explode 2s ease-out forwards;
        }
        
        .popup-show {
          animation: popupShow 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
      `}</style>

      {/* Center Message */}
      <div
        className="absolute top-1/2 left-1/2 z-10 max-w-[90%] md:w-auto w-full inline-block px-4! md:px-8! py-4! md:py-6! rounded-[30px] text-center pulse-animation"
        style={{
          transform: 'translate(-50%, -50%)',
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 240, 245, 0.9))',
          boxShadow:
            '0 20px 60px rgba(216, 27, 96, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <strong className="block text-3xl md:text-4xl mb-4 font-bold gradient-text">
          Chúc mừng 20-10
        </strong>
        <span
          className="text-xl md:text-2xl font-normal text-pink-700"
          dangerouslySetInnerHTML={{ __html: centerText }}
        />
      </div>

      {/* Falling Letters */}
      {fallingLetters.map((letter) => (
        <img
          key={letter.id}
          src={letter.src}
          alt="letter"
          className={`absolute w-12 md:w-[50px] cursor-pointer select-none z-[2] ${
            letter.clicked ? 'letter-clicked' : 'falling-letter'
          }`}
          style={{
            top: '-100px',
            left: `${letter.left}px`,
          }}
          onClick={(e) => handleLetterClick(e, letter.id)}
        />
      ))}

      {/* Hearts */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="heart absolute pointer-events-none select-none"
          style={
            {
              left: `${heart.x}px`,
              top: `${heart.y}px`,
              fontSize: `${heart.size}px`,
              '--dx': `${heart.dx}px`,
              '--dy': `${heart.dy}px`,
            } as React.CSSProperties
          }
        >
          💗
        </div>
      ))}

      {/* Bottom GIF */}
      <img
        src="./assets/mewmew.gif"
        alt="GIF"
        className="fixed bottom-5 left-1/2 w-[150px] max-w-[40vw] z-10 pointer-events-none"
        style={{ transform: 'translateX(-50%)' }}
      />

      {/* Overlay */}
      {showPopup && (
        <div
          className="fixed top-0 left-0 w-screen h-screen z-[99]"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
          }}
          onClick={handleClosePopup}
        />
      )}

      {/* Popup */}
      {showPopup && (
        <div
          className="popup-show fixed top-1/2 left-1/2 z-[100] w-[90%] max-w-[400px] p-6 md:p-8 rounded-[25px] text-center"
          style={{
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(135deg, #ffffff 0%, #fff5f8 100%)',
            boxShadow: '0 25px 80px rgba(216, 27, 96, 0.4)',
            border: '3px solid rgba(255, 255, 255, 0.8)',
          }}
        >
          <div className="mt-5">
            <img
              src={messages[currentMessageIndex].img}
              alt="Lời chúc"
              className="w-full rounded-[15px] mb-5 border-4 border-white"
              style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}
            />
            <p className="text-lg md:text-xl text-pink-700 leading-relaxed mb-5 font-medium">
              {messages[currentMessageIndex].text}
            </p>
          </div>
        </div>
      )}

      {/* Audio */}
      <audio ref={audioRef} src="./assets/a.mp3" />
    </div>
  )
}
