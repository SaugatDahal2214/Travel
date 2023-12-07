import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'trekkingtrales@gmail.com', // Replace with your Gmail email
    pass: 'shnj ekoi arjo bwkl', // Replace with your Gmail password
  },
});

// Function to send email verification link
export const sendVerificationEmail = async (email, userId) => {
  try {
    const verificationLink = `http://localhost:3000/verifyEmail/${userId}`;

    // Email content
    const mailOptions = {
      from: 'trekkingtrales@gmail.com', // Replace with your email
      to: email,
      subject: 'Email Verification',
      text: `Click on the following link to verify your email: ${verificationLink}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Verification Email sent successfully');
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

export default transporter;
