import { useState } from 'react';
import emailjs from '@emailjs/browser';
import './Mail.css';

const Mail = () => {
  const [formData, setFormData] = useState({
    to_email: 'sahilsingh0322@gmail.com',
    from_email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        {
          to_email: formData.to_email,
          from_email: formData.from_email,
          subject: formData.subject,
          message: formData.message
        },
        'YOUR_PUBLIC_KEY'
      );

      setStatus('Message sent successfully!');
      setFormData({ to_email: 'sahilsingh0322@gmail.com', from_email: '', subject: '', message: '' });

      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Error sending email:', error);
      setStatus('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="mail-app">
      <div className="mail-content">
        <form onSubmit={handleSubmit} className="mail-form">
          <div className="form-group">
            <input
              type="email"
              name="to_email"
              value={formData.to_email}
              onChange={handleChange}
              placeholder="To: recipient@example.com"
              required
              className="mail-input"
              disabled
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="from_email"
              value={formData.from_email}
              onChange={handleChange}
              placeholder="From: your.email@example.com"
              required
              className="mail-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
              className="mail-input"
            />
          </div>

          <div className="form-group message-group">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Compose your message here..."
              rows={12}
              required
              className="mail-textarea"
            />
          </div>

          <div className="form-actions">
            <div className="status-message">{status}</div>
            <button
              type="submit"
              className="send-button"
              style={{
                backgroundColor: '#FF3B30',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 24px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                minWidth: '80px',
                textAlign: 'center',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
              }}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Mail;
