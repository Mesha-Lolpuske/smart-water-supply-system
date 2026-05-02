import api from './api'

const faqService = {
  getPublicFaqs: async () => {
    const response = await api.get('/faqs');
    return response.data;
  },
  
  askQuestion: async (questionData) => {
    const response = await api.post('/faqs/ask', questionData);
    return response.data;
  },

  getMyQuestions: async () => {
    const response = await api.get('/faqs/my-questions');
    return response.data;
  },
  
  getAdminFaqs: async () => {
    const response = await api.get('/faqs/admin');
    return response.data;
  },
  
  answerQuestion: async (id, answerData) => {
    const response = await api.patch(`/faqs/${id}/answer`, answerData);
    return response.data;
  }
}

export default faqService;