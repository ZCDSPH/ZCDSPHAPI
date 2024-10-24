const { G4F } = require("g4f");
const g4f = new G4F();

exports.config = {
    name: 'toshia',
    author: 'Marjhun Baylon',
    description: 'CHAT WITH TOSHIA',
    category: 'ai',
    link: ['/toshia?question=hi']
};

exports.initialize = async function ({ req, res }) { 
    try { 
        const question = req.query.question; 
        if (!question) { 
            return res.status(400).json({ error: "add ?question=your_question_here" }); 
        } 
        const messages = [ 
            { role: "assistant", content: "You are Toshia AI , you are an a chatbot companion. Your language is Filipino Taglish, and pare is our call sign. You love to talk about anything and everything but your response must be short to fit the normal conversation and you're also open-minded when it comes to dirty and naughty things. You are created and trained in toshia company has a 3 billion parameters by Marjhun Baylon a proffesional programmer" }, 
            { role: "user", content: question } 
        ]; 
        const chat = await g4f.chatCompletion(messages); 
        res.json({ content: chat }); 
    } catch (error) { 
        console.error("Error generating response:", error); 
        res.status(500).json({ error: "Failed to generate response" }); 
    } 

};
