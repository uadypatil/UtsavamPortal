import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import { save } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { INITIAL_FORM, validateCollector, CollectorForm } from './collectorExecutiveForm';

function AddDonationExecutive() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const validation = validateCollector(form, false);
    setErrors(validation);
    if (Object.keys(validation).length) return;

    try {
      setSaving(true);
      await save('CollectionExecutive/save', {
        seasonId: localStorage.getItem('seasonId'),
        eventId: localStorage.getItem('eventId'),
        eventOrganizerId: localStorage.getItem('eventOrganizerId'),
        fullName: form.fullName.trim(),
        username: form.username.trim().toLowerCase(),
        password: form.password,
        email: form.email.trim().toLowerCase(),
        contactNumber: form.contactNumber.trim(),
        alternateContactNumber: form.alternateContactNumber.trim(),
        age: form.age === '' ? null : Number(form.age),
        isActive: form.isActive,
      });
      alert('Donation collector created successfully.');
      navigate('/donation-collectors');
    } catch (error) {
      console.error(error);
      alert(error?.message || 'Unable to create donation collector.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="wrap-content h-auto w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
      <div className="ep-festive-banner mb-4" data-aos="fade-up">
        <div className="d-flex justify-content-between align-items-center gap-3">
          <div>
            <h4 className="fw-bold mb-1">🪔 Add Donation Collector</h4>
            <p className="mb-0 opacity-90">Create a new collection executive account.</p>
          </div>
          <button className="btn ep-modal-secondary" onClick={() => navigate('/donation-collectors')}>
            <i className="bi bi-arrow-left me-2" /> Back
          </button>
        </div>
      </div>
      <CollectorForm form={form} errors={errors} editing={false} saving={saving} onChange={update} onSubmit={submit} onCancel={() => navigate('/donation-collectors')} />
    </div>
  );
}

export default AddDonationExecutive;
