{
  "designSystem": {
    "theme": {
      "name": "Dopamine Learning System",
      "philosophy": "Maksymalizacja dopaminowych strzałów poprzez gamifikację, nagrody wizualne i interaktywność",
      "primaryGoal": "Sprawić, aby nauka była uzależniająca w pozytywny sposób"
    },
    
    "colors": {
      "backgrounds": {
        "primary": "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900",
        "secondary": "bg-white/10 backdrop-blur-lg",
        "tertiary": "bg-black/20 backdrop-blur-sm",
        "success": "bg-green-500/20 backdrop-blur-sm",
        "error": "bg-red-500/20 backdrop-blur-sm",
        "warning": "bg-amber-500/20 backdrop-blur-sm"
      },
      
      "gradients": {
        "primary": "bg-gradient-to-r from-blue-500 to-purple-600",
        "secondary": "bg-gradient-to-r from-violet-500 to-purple-600",
        "success": "bg-gradient-to-r from-green-500 to-emerald-600",
        "warning": "bg-gradient-to-r from-amber-400 to-orange-500",
        "danger": "bg-gradient-to-r from-red-500 to-red-600",
        "accent": "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
        "level": {
          "easy": "bg-gradient-to-r from-green-400 to-green-600",
          "medium": "bg-gradient-to-r from-amber-400 to-amber-600",
          "hard": "bg-gradient-to-r from-red-400 to-red-600"
        }
      },
      
      "text": {
        "primary": "text-white",
        "secondary": "text-gray-300",
        "muted": "text-gray-400",
        "accent": "text-purple-400",
        "success": "text-green-400",
        "error": "text-red-400",
        "warning": "text-amber-400"
      },
      
      "borders": {
        "primary": "border border-white/20",
        "secondary": "border border-white/10",
        "success": "border border-green-500/30",
        "error": "border border-red-500/30",
        "warning": "border border-amber-500/30"
      }
    },
    
    "components": {
      "cards": {
        "primary": {
          "class": "bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-6",
          "hover": "hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02]"
        },
        "secondary": {
          "class": "bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10",
          "hover": "hover:bg-black/30 transition-all duration-300"
        },
        "achievement": {
          "class": "bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl shadow-2xl border-2 border-yellow-300",
          "animation": "animate-bounce"
        }
      },
      
      "buttons": {
        "primary": {
          "class": "px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105",
          "disabled": "disabled:from-gray-600 disabled:to-gray-700 disabled:transform-none disabled:shadow-none"
        },
        "secondary": {
          "class": "px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/20 transform hover:scale-105"
        },
        "success": {
          "class": "px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        },
        "icon": {
          "class": "w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/20 transform hover:scale-110 flex items-center justify-center"
        }
      },
      
      "inputs": {
        "primary": {
          "class": "px-6 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg font-medium bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 border-white/20",
          "success": "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg shadow-green-500/20",
          "error": "border-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg shadow-red-500/20"
        }
      },
      
      "progressBars": {
        "primary": {
          "container": "bg-gray-800/50 backdrop-blur-sm rounded-full h-4 overflow-hidden border border-white/10",
          "fill": "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-4 rounded-full transition-all duration-1000 ease-out relative",
          "shine": "absolute inset-0 bg-white/20 animate-pulse"
        },
        "xp": {
          "container": "bg-gray-700 rounded-full overflow-hidden",
          "fill": "bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500"
        },
        "energy": {
          "container": "bg-gray-700 rounded-full overflow-hidden",
          "fill": {
            "high": "bg-gradient-to-r from-green-400 to-green-600",
            "medium": "bg-gradient-to-r from-yellow-400 to-yellow-600",
            "low": "bg-gradient-to-r from-red-400 to-red-600"
          }
        }
      },
      
      "statCards": {
        "primary": {
          "container": "text-center group cursor-pointer",
          "icon": "flex items-center justify-center w-14 h-14 backdrop-blur-sm rounded-xl mb-2 group-hover:scale-110 transition-transform",
          "value": "text-2xl font-bold text-white",
          "label": "text-xs text-gray-400",
          "colors": {
            "success": "bg-gradient-to-br from-green-400/20 to-green-600/20 border border-green-500/30",
            "primary": "bg-gradient-to-br from-blue-400/20 to-blue-600/20 border border-blue-500/30",
            "warning": "bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/30",
            "accent": "bg-gradient-to-br from-purple-400/20 to-purple-600/20 border border-purple-500/30"
          }
        }
      },
      
      "feedback": {
        "success": {
          "class": "p-4 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-xl",
          "icon": "w-5 h-5 text-green-400",
          "text": "text-green-300 font-medium"
        },
        "error": {
          "class": "p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl",
          "icon": "w-5 h-5 text-red-400",
          "text": "text-red-300 font-medium"
        },
        "streak": {
          "class": "inline-flex items-center bg-orange-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-500/30",
          "text": "text-orange-300 font-bold"
        }
      }
    },
    
    "animations": {
      "entrance": {
        "fadeIn": "animate-fade-in",
        "slideUp": "animate-slide-up",
        "bounce": "animate-bounce",
        "pulse": "animate-pulse",
        "spin": "animate-spin"
      },
      
      "interactions": {
        "hover": "transition-all duration-300 transform hover:scale-105",
        "hoverLight": "transition-all duration-300 transform hover:scale-[1.02]",
        "hoverIcon": "transition-all duration-300 transform hover:scale-110",
        "click": "active:scale-95 transition-transform duration-150"
      },
      
      "particles": {
        "success": {
          "colors": ["#10B981", "#34D399", "#6EE7B7"],
          "animation": "animate-ping",
          "duration": 3000
        },
        "celebration": {
          "colors": ["#F59E0B", "#FBBF24", "#FCD34D"],
          "animation": "animate-bounce",
          "duration": 3000
        }
      }
    },
    
    "gamification": {
      "achievements": {
        "popup": {
          "position": "fixed top-20 left-1/2 transform -translate-x-1/2 z-50",
          "class": "bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl shadow-2xl border-2 border-yellow-300",
          "animation": "animate-bounce",
          "duration": 3000
        },
        
        "types": {
          "first_success": {
            "name": "Pierwszy sukces!",
            "icon": "🎯",
            "trigger": "first_correct_answer"
          },
          "streak_5": {
            "name": "Na fali!",
            "icon": "🔥",
            "trigger": "5_correct_in_row"
          },
          "streak_10": {
            "name": "Niepokonany!",
            "icon": "⚡",
            "trigger": "10_correct_in_row"
          },
          "speed_demon": {
            "name": "Demon prędkości",
            "icon": "💨",
            "trigger": "answer_under_3_seconds"
          },
          "perfectionist": {
            "name": "Perfekcjonista",
            "icon": "👑",
            "trigger": "complete_category_no_errors"
          }
        }
      },
      
      "xpSystem": {
        "baseXP": 10,
        "streakBonus": 5,
        "comboBonus": 10,
        "perfectBonus": 50,
        "levelMultiplier": 100
      },
      
      "streakSystem": {
        "bonusThresholds": [5, 10, 15, 20],
        "visualEffects": {
          "5": "🔥",
          "10": "⚡",
          "15": "💫",
          "20": "👑"
        }
      }
    },
    
    "layout": {
      "container": {
        "main": "max-w-6xl mx-auto px-4 py-6 relative",
        "card": "max-w-4xl mx-auto px-4 py-6"
      },
      
      "spacing": {
        "section": "mb-6",
        "card": "p-6",
        "cardLarge": "p-8",
        "grid": "gap-6",
        "gridSmall": "gap-3"
      },
      
      "responsive": {
        "grid2": "grid md:grid-cols-2 gap-6",
        "grid3": "grid grid-cols-2 md:grid-cols-3 gap-3",
        "flexWrap": "flex flex-wrap gap-6 items-center justify-between",
        "flexCol": "flex flex-col sm:flex-row gap-3"
      }
    },
    
    "typography": {
      "headings": {
        "h1": "text-4xl md:text-5xl font-bold text-white",
        "h2": "text-3xl font-bold text-white",
        "h3": "text-xl font-semibold text-white",
        "display": "text-6xl font-bold text-white"
      },
      
      "body": {
        "primary": "text-gray-300 text-lg",
        "secondary": "text-gray-400",
        "small": "text-sm text-gray-400",
        "bold": "font-bold text-white"
      }
    },
    
    "effects": {
      "glassmorphism": {
        "primary": "backdrop-blur-lg bg-white/10 border border-white/20",
        "secondary": "backdrop-blur-sm bg-white/5 border border-white/10",
        "dark": "backdrop-blur-sm bg-black/20 border border-white/10"
      },
      
      "shadows": {
        "soft": "shadow-2xl",
        "colored": "shadow-lg shadow-blue-500/30",
        "success": "shadow-lg shadow-green-500/20",
        "error": "shadow-lg shadow-red-500/20"
      },
      
      "overlays": {
        "gradient": "absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse",
        "shine": "absolute inset-0 bg-white/20 animate-pulse"
      }
    },
    
    "usage": {
      "principles": [
        "Każda interakcja powinna dawać natychmiastową wizualną odpowiedź",
        "Używaj animacji transform:scale dla efektu 'responsywności'",
        "Gradientowe tła dla wszystkich głównych elementów",
        "Backdrop-blur dla efektu szkła na każdym elemencie UI",
        "Konsekwentne używanie white/opacity dla przezroczystości",
        "Animacje transition-all duration-300 jako standard",
        "Cząsteczki i efekty wizualne dla pozytywnych akcji",
        "System osiągnięć z popup'ami dla dopaminowych strzałów"
      ],
      
      "patterns": {
        "cardWithHover": "bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-6 transition-all duration-300 transform hover:scale-[1.02] hover:bg-white/15",
        "buttonPrimary": "px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105",
        "statCard": "text-center group cursor-pointer",
        "progressBar": "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transition-all duration-1000 ease-out relative"
      }
    },
    
    "customCSS": {
      "keyframes": {
        "@keyframes fade-in": {
          "from": { "opacity": "0", "transform": "translateY(20px)" },
          "to": { "opacity": "1", "transform": "translateY(0)" }
        },
        "@keyframes slide-up": {
          "from": { "transform": "translateY(100%)" },
          "to": { "transform": "translateY(0)" }
        },
        "@keyframes particle-float": {
          "0%": { "transform": "translateY(0) scale(1)", "opacity": "1" },
          "50%": { "transform": "translateY(-50px) scale(1.2)", "opacity": "0.8" },
          "100%": { "transform": "translateY(-100px) scale(0)", "opacity": "0" }
        }
      },
      
      "utilities": {
        ".animate-fade-in": { "animation": "fade-in 0.5s ease-out" },
        ".animate-slide-up": { "animation": "slide-up 0.3s ease-out" },
        ".animate-particle": { "animation": "particle-float 3s ease-out forwards" }
      }
    }
  }
}