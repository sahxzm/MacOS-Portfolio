import { useState } from 'react';
import emailjs from '@emailjs/browser';
import './Mail.css';

// Debug log environment variables
console.log('EmailJS Config:', {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ? '***' : 'Not found'
});

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

    const emailData = {
      to_email: formData.to_email,
      from_email: formData.from_email,
      subject: formData.subject,
      message: formData.message
    };

    console.log('Sending email with data:', emailData);

    try {
      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        emailData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      console.log('Email sent successfully:', result);
      setStatus('Message sent successfully!');
      setFormData(prev => ({
        ...prev,
        from_email: '',
        subject: '',
        message: ''
      }));
    } catch (error: any) {
      console.error('Email sending failed:', {
        error,
        status: error?.status,
        text: error?.text,
        response: error?.response
      });
      setStatus(`Failed to send: ${error?.text || 'Unknown error'}`);
    } finally {
      setTimeout(() => setStatus(''), 5000);
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
