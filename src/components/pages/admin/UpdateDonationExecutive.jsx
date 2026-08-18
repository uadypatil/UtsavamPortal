import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import { collectionExecutivesApi } from '../../../services/endpoints/collectionExecutives';
import { apiErrorMessage } from '../../../services/httpClient';
import { useToast } from '../../../context/ToastContext';
import { useNavigate, useParams } from 'react-router-dom';
import { INITIAL_FORM, validateCollector, CollectorForm } from './collectorExecutiveForm';

function UpdateDonationExecutive() {
  const { donationExecutiveId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
    loadCollector();
  }, [donationExecutiveId]);

  const loadCollector = async () => {
    try {
      setLoading(true);
      const c = await collectionExecutivesApi.get(donationExecutiveId);

      setForm({
        fullName: c.fullName || '',
        username: c.username || '',
        password: '',
        email: c.email || '',
        contactNumber: c.contactNumber || '',
        alternateContactNumber: c.alternateContactNumber || '',
        age: c.age ?? '',
        isActive: c.isActive ?? true,
      });
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Unable to load donation collector.'));
      navigate('/admin/donationcollector');
    } finally {
      setLoading(false);
    }
  };

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const submit = async (e) => {
    e.preventDefault();

    const validation = validateCollector(form, true);
    setErrors(validation);
    if (Object.keys(validation).length) return;

    try {
      setSaving(true);

      const payload = {
        seasonId: localStorage.getItem('seasonId'),
        eventId: localStorage.getItem('eventId'),
        eventOrganizerId: localStorage.getItem('eventOrganizerId'),
        fullName: form.fullName.trim(),
        username: form.username.trim().toLowerCase(),
        email: form.email.trim().toLowerCase(),
        contactNumber: form.contactNumber.trim(),
        alternateContactNumber: form.alternateContactNumber.trim(),
        age: form.age === '' ? null : Number(form.age),
        isActive: form.isActive,
      };

      if (form.password.trim()) payload.password = form.password.trim();

      // PATCH /collection-executives/{id} — id goes in the URL, not the body.
      await collectionExecutivesApi.update(donationExecutiveId, payload);

      toast.success('Donation collector updated successfully.');
      navigate('/admin/donationcollector');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Unable to update donation collector.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="wrap-content h-auto w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
        <div className="ep-chart-card">
          <div className="ep-skeleton ep-skeleton-title mb-4" style={{ width: 220 }} />
          <div className="row g-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="col-md-6" key={i}>
                <div className="ep-skeleton" style={{ height: 44, borderRadius: 8 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap-content h-auto w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
      <div className="ep-festive-banner mb-4" data-aos="fade-up">
        <div className="d-flex justify-content-between align-items-center gap-3">
          <div>
            <h4 className="fw-bold mb-1">🪔 Update Donation Collector</h4>
            <p className="mb-0 opacity-90">Update collection executive account details.</p>
          </div>
          <button className="btn ep-modal-secondary" onClick={() => navigate('/admin/donationcollector')}>
            <i className="bi bi-arrow-left me-2" /> Back
          </button>
        </div>
      </div>

      <CollectorForm
        form={form}
        errors={errors}
        editing
        saving={saving}
        onChange={update}
        onSubmit={submit}
        onCancel={() => navigate('/admin/donationcollector')}
      />
    </div>
  );
}

export default UpdateDonationExecutive;
