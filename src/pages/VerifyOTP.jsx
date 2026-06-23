import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function VerifyOTP() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const student = location.state?.student;
  const email = location.state?.email;

  useEffect(() => {
    if (!student || !email) {
      navigate('/');
    }
  }, [student, email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: token.trim(),
        type: 'email'
      });

      if (verifyError) throw verifyError;

      // Update student record
      const { error: updateError } = await supabase
        .from('students')
        .update({
          email: email,
          email_verified: true,
          verified_at: new Date().toISOString()
        })
        .eq('student_id', student.student_id);

      if (updateError) throw updateError;

      setSuccess(true);
      // Automatically navigate to status board after short delay
      setTimeout(() => {
        navigate('/status');
      }, 3000);
    } catch (err) {
      setError('인증 번호가 올바르지 않거나 만료되었습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card MC-container text-center">
        <h2>인증 완료! 🎉</h2>
        <p className="success-msg mt-4 mb-4">
          마인크래프트 계정 신청이 성공적으로 완료되었습니다.
        </p>
        <button onClick={() => navigate('/status')} className="mc-btn btn-secondary mt-4">
          현황 게시판으로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="card MC-container">
      <h2>이메일 인증</h2>
      <p className="help-text">
        <strong>{email}</strong> 로 전송된<br />인증 코드를 입력해주세요. (최대 3분 소요)
      </p>

      <form onSubmit={handleVerify} className="mc-form mt-4">
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="인증 코드 입력"
          required
          maxLength={10}
          className="mc-input otp-input"
        />
        <button type="submit" disabled={loading} className="mc-btn btn-success">
          {loading ? '확인 중...' : '인증하기'}
        </button>
        {error && <div className="error-msg">{error}</div>}
        <button 
          type="button" 
          onClick={() => navigate('/')} 
          className="mc-btn btn-danger mt-2"
        >
          ❌ 취소 및 학번 재입력
        </button>
      </form>
    </div>
  );
}
