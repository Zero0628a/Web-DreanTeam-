export interface User {
    name: string
    email: string
    stats: {
      solved: number
      created: number
      score: number
    }
    skills: Skill[]
    activities: Activity[]
  }
  
  export interface Skill {
    name: string
    progress: number
  }
  
  export interface Activity {
    date: string
    name: string
    type: string
    result: string
  }
  
  export interface Question {
    title: string
    description: string
    type: "order-words" | "order-shapes" | "drawing" | "incoherence"
    words?: string[]
    correctOrders?: string[];
    correctOrder?: string
    incoherentText?: string
    correctText?: string
    image: string | null
    feedbackCorrect: string
    feedbackIncorrect: string
  }
  