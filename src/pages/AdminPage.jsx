import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AdminPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('student_id');
      
      if (error) throw error;
      setStudents(data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    // CSV Header
    const headers = ['학번', '이름', '이메일', '제출완료여부', '인증일시'];
    
    // CSV Rows
    const rows = students.map(s => [
      s.student_id,
      s.name,
      s.email || '',
      s.email_verified ? 'O' : 'X',
      s.verified_at ? new Date(s.verified_at).toLocaleString('ko-KR') : ''
    ]);

    // Construct CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    // Add BOM for Excel UTF-8 display
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `minecraft_accounts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const verifiedCount = students.filter(s => s.email_verified).length;

  return (
    <div className="card MC-container wide">
      <h2>관리자 대시보드</h2>
      
      <div className="admin-actions mt-4 mb-4">
        <div>
          총 <strong>{students.length}</strong>명 중 <strong className="text-success">{verifiedCount}</strong>명 제출 완료
        </div>
        <button onClick={handleDownloadCSV} className="mc-btn btn-success" disabled={loading}>
          ⬇️ CSV 다운로드
        </button>
      </div>

      {loading ? (
        <p className="loading-text">로딩 중...</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="mc-table">
              <thead>
                <tr>
                  <th>학번</th>
                  <th>이름</th>
                  <th>이메일</th>
                  <th>상태</th>
                  <th>인증 일시</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td>{s.student_id}</td>
                    <td>{s.name}</td>
                    <td>{s.email || '-'}</td>
                    <td>
                      {s.email_verified ? (
                        <span className="text-success">완료</span>
                      ) : (
                        <span className="text-danger">미완료</span>
                      )}
                    </td>
                    <td>{s.verified_at ? new Date(s.verified_at).toLocaleString('ko-KR') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mc-nav">
            <button onClick={() => navigate('/')} className="mc-btn btn-primary mc-nav-btn">
              🏠 메인 페이지로 이동
            </button>
          </div>
        </>
      )}
    </div>
  );
}

