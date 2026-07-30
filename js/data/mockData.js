const MockData = {
  users: [
    { id: 'usr-1', name: 'Dr. Sarah Johnson', email: 'admin@medicore.com', password: 'Admin123!', role: 'admin', department: 'Cardiology', avatar: null, phone: '(555) 123-4567', joinDate: '2020-01-15', status: 'active', lastLogin: new Date().toISOString() },
    { id: 'usr-2', name: 'Dr. Michael Chen', email: 'doctor@medicore.com', password: 'Doctor123!', role: 'doctor', department: 'Neurology', avatar: null, phone: '(555) 234-5678', joinDate: '2021-03-10', status: 'active', lastLogin: new Date().toISOString() },
    { id: 'usr-3', name: 'Nurse Emily Davis', email: 'nurse@medicore.com', password: 'Nurse123!', role: 'nurse', department: 'Emergency', avatar: null, phone: '(555) 345-6789', joinDate: '2022-06-20', status: 'active', lastLogin: new Date().toISOString() },
    { id: 'usr-4', name: 'John Smith', email: 'reception@medicore.com', password: 'Reception123!', role: 'reception', department: 'Front Desk', avatar: null, phone: '(555) 456-7890', joinDate: '2023-02-01', status: 'active', lastLogin: new Date().toISOString() },
    { id: 'usr-5', name: 'Lisa Wang', email: 'pharmacy@medicore.com', password: 'Pharmacy123!', role: 'pharmacist', department: 'Pharmacy', avatar: null, phone: '(555) 567-8901', joinDate: '2021-11-15', status: 'active', lastLogin: new Date().toISOString() },
    { id: 'usr-6', name: 'Robert Kim', email: 'lab@medicore.com', password: 'Lab123!', role: 'lab_technician', department: 'Laboratory', avatar: null, phone: '(555) 678-9012', joinDate: '2022-08-01', status: 'active', lastLogin: new Date().toISOString() },
    { id: 'usr-7', name: 'Amanda Taylor', email: 'hr@medicore.com', password: 'Hr123!', role: 'hr', department: 'Human Resources', avatar: null, phone: '(555) 789-0123', joinDate: '2020-09-01', status: 'active', lastLogin: new Date().toISOString() }
  ],

  doctors: [
    { id: 'DR001', name: 'Dr. Sarah Johnson', department: 'Cardiology', specialization: 'Interventional Cardiology', email: 'sarah.j@medicore.com', phone: '(555) 123-0001', availability: 'Mon-Fri 9AM-5PM', patientsCount: 145, rating: 4.8, experience: 15, education: 'Harvard Medical School', status: 'active', consultationFee: 200, avatar: null, nextAvailable: '2024-01-15T09:00:00' },
    { id: 'DR002', name: 'Dr. Michael Chen', department: 'Neurology', specialization: 'Neurological Surgery', email: 'michael.c@medicore.com', phone: '(555) 123-0002', availability: 'Mon-Thu 8AM-4PM', patientsCount: 98, rating: 4.9, experience: 18, education: 'Johns Hopkins University', status: 'active', consultationFee: 250, avatar: null, nextAvailable: '2024-01-16T10:00:00' },
    { id: 'DR003', name: 'Dr. Emily Rodriguez', department: 'Pediatrics', specialization: 'Pediatric Cardiology', email: 'emily.r@medicore.com', phone: '(555) 123-0003', availability: 'Tue-Sat 10AM-6PM', patientsCount: 210, rating: 4.7, experience: 12, education: 'Stanford Medical School', status: 'active', consultationFee: 180, avatar: null, nextAvailable: '2024-01-15T14:00:00' },
    { id: 'DR004', name: 'Dr. James Wilson', department: 'Orthopedics', specialization: 'Sports Medicine', email: 'james.w@medicore.com', phone: '(555) 123-0004', availability: 'Mon-Fri 7AM-3PM', patientsCount: 167, rating: 4.6, experience: 20, education: 'Mayo Clinic', status: 'active', consultationFee: 220, avatar: null, nextAvailable: '2024-01-17T08:00:00' },
    { id: 'DR005', name: 'Dr. Patricia Lee', department: 'Dermatology', specialization: 'Cosmetic Dermatology', email: 'patricia.l@medicore.com', phone: '(555) 123-0005', availability: 'Wed-Sun 11AM-7PM', patientsCount: 89, rating: 4.5, experience: 10, education: 'UCLA Medical Center', status: 'active', consultationFee: 190, avatar: null, nextAvailable: '2024-01-15T11:00:00' },
    { id: 'DR006', name: 'Dr. David Thompson', department: 'Emergency Medicine', specialization: 'Trauma Care', email: 'david.t@medicore.com', phone: '(555) 123-0006', availability: 'Mon-Sun (Rotating)', patientsCount: 320, rating: 4.9, experience: 14, education: 'University of Chicago', status: 'active', consultationFee: 175, avatar: null, nextAvailable: '2024-01-15T08:00:00' },
    { id: 'DR007', name: 'Dr. Maria Garcia', department: 'Ophthalmology', specialization: 'Cataract Surgery', email: 'maria.g@medicore.com', phone: '(555) 123-0007', availability: 'Mon-Fri 9AM-5PM', patientsCount: 134, rating: 4.7, experience: 16, education: 'Bascom Palmer Eye Institute', status: 'active', consultationFee: 210, avatar: null, nextAvailable: '2024-01-16T09:00:00' },
    { id: 'DR008', name: 'Dr. Robert Brown', department: 'Psychiatry', specialization: 'Child & Adolescent', email: 'robert.b@medicore.com', phone: '(555) 123-0008', availability: 'Tue-Fri 10AM-6PM', patientsCount: 76, rating: 4.4, experience: 22, education: 'Yale Medical School', status: 'active', consultationFee: 230, avatar: null, nextAvailable: '2024-01-18T13:00:00' },
    { id: 'DR009', name: 'Dr. Jennifer Martinez', department: 'Obstetrics & Gynecology', specialization: 'Maternal-Fetal Medicine', email: 'jennifer.m@medicore.com', phone: '(555) 123-0009', availability: 'Mon-Thu 8AM-4PM', patientsCount: 256, rating: 4.8, experience: 13, education: 'UCSF Medical Center', status: 'active', consultationFee: 240, avatar: null, nextAvailable: '2024-01-15T13:00:00' },
    { id: 'DR010', name: 'Dr. William Anderson', department: 'Oncology', specialization: 'Medical Oncology', email: 'william.a@medicore.com', phone: '(555) 123-0010', availability: 'Mon-Fri 9AM-5PM', patientsCount: 192, rating: 4.9, experience: 19, education: 'MD Anderson Cancer Center', status: 'active', consultationFee: 260, avatar: null, nextAvailable: '2024-01-17T10:00:00' },
    { id: 'DR011', name: 'Dr. Lisa Thompson', department: 'Radiology', specialization: 'Interventional Radiology', email: 'lisa.t@medicore.com', phone: '(555) 123-0011', availability: 'Mon-Fri 8AM-4PM', patientsCount: 112, rating: 4.6, experience: 11, education: 'Massachusetts General Hospital', status: 'active', consultationFee: 195, avatar: null, nextAvailable: '2024-01-16T08:00:00' },
    { id: 'DR012', name: 'Dr. Kevin Park', department: 'Anesthesiology', specialization: 'Cardiac Anesthesia', email: 'kevin.p@medicore.com', phone: '(555) 123-0012', availability: 'Mon-Fri (On Call)', patientsCount: 200, rating: 4.7, experience: 17, education: 'Cleveland Clinic', status: 'active', consultationFee: 185, avatar: null, nextAvailable: '2024-01-15T07:00:00' }
  ],

  patients: [
    { id: 'PT001', name: 'Alice Cooper', dob: '1985-03-15', gender: 'F', bloodGroup: 'A+', phone: '(555) 100-0001', email: 'alice.c@email.com', address: '123 Main St, Springfield, IL', emergencyContact: '(555) 100-0001', emergencyName: 'Bob Cooper', insurance: 'BlueCross PPO', insuranceId: 'BC-12345', allergies: ['Penicillin', 'Peanuts'], medicalConditions: ['Asthma'], status: 'active', lastVisit: '2024-12-20T10:30:00', registrationDate: '2023-06-15', totalVisits: 12, avatar: null },
    { id: 'PT002', name: 'Bob Martin', dob: '1978-07-22', gender: 'M', bloodGroup: 'O-', phone: '(555) 100-0002', email: 'bob.m@email.com', address: '456 Oak Ave, Portland, OR', emergencyContact: '(555) 100-0002', emergencyName: 'Carol Martin', insurance: 'Aetna HMO', insuranceId: 'AE-67890', allergies: ['Sulfa'], medicalConditions: ['Hypertension', 'Type 2 Diabetes'], status: 'active', lastVisit: '2024-12-18T14:00:00', registrationDate: '2023-01-10', totalVisits: 24, avatar: null },
    { id: 'PT003', name: 'Carol White', dob: '1992-11-08', gender: 'F', bloodGroup: 'B+', phone: '(555) 100-0003', email: 'carol.w@email.com', address: '789 Pine Rd, Austin, TX', emergencyContact: '(555) 100-0003', emergencyName: 'David White', insurance: 'Cigna PPO', insuranceId: 'CG-13579', allergies: ['Latex'], medicalConditions: [], status: 'active', lastVisit: '2024-12-22T09:15:00', registrationDate: '2024-02-20', totalVisits: 5, avatar: null },
    { id: 'PT004', name: 'David Brown', dob: '1965-05-30', gender: 'M', bloodGroup: 'AB+', phone: '(555) 100-0004', email: 'david.b@email.com', address: '321 Elm St, Denver, CO', emergencyContact: '(555) 100-0004', emergencyName: 'Susan Brown', insurance: 'Medicare', insuranceId: 'MC-24680', allergies: ['Codeine'], medicalConditions: ['CAD', 'Hyperlipidemia'], status: 'active', lastVisit: '2024-12-15T11:00:00', registrationDate: '2022-08-05', totalVisits: 32, avatar: null },
    { id: 'PT005', name: 'Eva Green', dob: '1995-01-14', gender: 'F', bloodGroup: 'A-', phone: '(555) 100-0005', email: 'eva.g@email.com', address: '654 Maple Dr, Seattle, WA', emergencyContact: '(555) 100-0005', emergencyName: 'Frank Green', insurance: 'UnitedHealth', insuranceId: 'UH-11223', allergies: ['Ibuprofen'], medicalConditions: ['Migraine'], status: 'active', lastVisit: '2024-12-19T16:30:00', registrationDate: '2024-03-12', totalVisits: 8, avatar: null },
    { id: 'PT006', name: 'Frank Harris', dob: '1988-09-12', gender: 'M', bloodGroup: 'O+', phone: '(555) 100-0006', email: 'frank.h@email.com', address: '987 Cedar Ln, Miami, FL', emergencyContact: '(555) 100-0006', emergencyName: 'Grace Harris', insurance: 'Cigna HMO', insuranceId: 'CG-44556', allergies: ['Sulfa', 'Aspirin'], medicalConditions: ['GERD'], status: 'active', lastVisit: '2024-12-21T08:45:00', registrationDate: '2023-09-01', totalVisits: 15, avatar: null },
    { id: 'PT007', name: 'Grace Kim', dob: '2000-04-03', gender: 'F', bloodGroup: 'AB-', phone: '(555) 100-0007', email: 'grace.k@email.com', address: '246 Birch Ct, Chicago, IL', emergencyContact: '(555) 100-0007', emergencyName: 'Henry Kim', insurance: 'Aetna PPO', insuranceId: 'AE-77889', allergies: [], medicalConditions: ['Anxiety'], status: 'active', lastVisit: '2024-12-17T13:00:00', registrationDate: '2024-05-18', totalVisits: 6, avatar: null },
    { id: 'PT008', name: 'Henry Wilson', dob: '1972-08-19', gender: 'M', bloodGroup: 'B-', phone: '(555) 100-0008', email: 'henry.w@email.com', address: '135 Walnut Ave, Boston, MA', emergencyContact: '(555) 100-0008', emergencyName: 'Iris Wilson', insurance: 'BlueCross HMO', insuranceId: 'BC-99001', allergies: ['Penicillin'], medicalConditions: ['COPD', 'Sleep Apnea'], status: 'active', lastVisit: '2024-12-14T10:00:00', registrationDate: '2022-04-22', totalVisits: 28, avatar: null },
    { id: 'PT009', name: 'Iris Taylor', dob: '1990-06-25', gender: 'F', bloodGroup: 'A+', phone: '(555) 100-0009', email: 'iris.t@email.com', address: '753 Spruce Way, San Francisco, CA', emergencyContact: '(555) 100-0009', emergencyName: 'Jack Taylor', insurance: 'UnitedHealth PPO', insuranceId: 'UH-33445', allergies: ['Peanuts', 'Shellfish'], medicalConditions: ['Eczema'], status: 'active', lastVisit: '2024-12-23T11:30:00', registrationDate: '2024-01-08', totalVisits: 4, avatar: null },
    { id: 'PT010', name: 'Jack Davis', dob: '1958-12-01', gender: 'M', bloodGroup: 'O+', phone: '(555) 100-0010', email: 'jack.d@email.com', address: '468 Cherry St, New York, NY', emergencyContact: '(555) 100-0010', emergencyName: 'Karen Davis', insurance: 'Medicare Advantage', insuranceId: 'MA-55667', allergies: ['Morphine'], medicalConditions: ['Osteoarthritis', 'Hypothyroidism'], status: 'active', lastVisit: '2024-12-12T15:00:00', registrationDate: '2022-01-15', totalVisits: 40, avatar: null },
    { id: 'PT011', name: 'Karen Moore', dob: '1983-02-28', gender: 'F', bloodGroup: 'B+', phone: '(555) 100-0011', email: 'karen.m@email.com', address: '159 Vine Ct, Dallas, TX', emergencyContact: '(555) 100-0011', emergencyName: 'Leo Moore', insurance: 'Cigna PPO', insuranceId: 'CG-12345', allergies: ['Doxycycline'], medicalConditions: ['Thyroiditis'], status: 'active', lastVisit: '2024-12-20T09:00:00', registrationDate: '2023-11-03', totalVisits: 9, avatar: null },
    { id: 'PT012', name: 'Leo Anderson', dob: '1975-10-10', gender: 'M', bloodGroup: 'A+', phone: '(555) 100-0012', email: 'leo.a@email.com', address: '357 Lake Dr, Phoenix, AZ', emergencyContact: '(555) 100-0012', emergencyName: 'Mia Anderson', insurance: 'BlueCross PPO', insuranceId: 'BC-67890', allergies: ['Sulfa', 'Penicillin', 'Codeine'], medicalConditions: ['Arrhythmia'], status: 'active', lastVisit: '2024-12-16T14:30:00', registrationDate: '2022-11-20', totalVisits: 18, avatar: null }
  ],

  appointments: [
    { id: 'APT001', patientId: 'PT001', patientName: 'Alice Cooper', doctorId: 'DR001', doctorName: 'Dr. Sarah Johnson', department: 'Cardiology', date: '2024-12-28T09:00:00', type: 'Check-up', status: 'scheduled', duration: 30, notes: 'Regular cardiac follow-up', createdAt: '2024-12-20T08:00:00' },
    { id: 'APT002', patientId: 'PT003', patientName: 'Carol White', doctorId: 'DR003', doctorName: 'Dr. Emily Rodriguez', department: 'Pediatrics', date: '2024-12-28T10:00:00', type: 'Consultation', status: 'scheduled', duration: 30, notes: 'Child wellness visit', createdAt: '2024-12-21T09:00:00' },
    { id: 'APT003', patientId: 'PT005', patientName: 'Eva Green', doctorId: 'DR005', doctorName: 'Dr. Patricia Lee', department: 'Dermatology', date: '2024-12-28T11:00:00', type: 'Follow-up', status: 'scheduled', duration: 20, notes: 'Skin rash follow-up', createdAt: '2024-12-22T10:00:00' },
    { id: 'APT004', patientId: 'PT002', patientName: 'Bob Martin', doctorId: 'DR002', doctorName: 'Dr. Michael Chen', department: 'Neurology', date: '2024-12-28T14:00:00', type: 'Procedure', status: 'confirmed', duration: 60, notes: 'MRI Review', createdAt: '2024-12-18T11:00:00' },
    { id: 'APT005', patientId: 'PT007', patientName: 'Grace Kim', doctorId: 'DR008', doctorName: 'Dr. Robert Brown', department: 'Psychiatry', date: '2024-12-29T09:00:00', type: 'Therapy', status: 'scheduled', duration: 50, notes: 'Weekly therapy session', createdAt: '2024-12-23T08:00:00' },
    { id: 'APT006', patientId: 'PT004', patientName: 'David Brown', doctorId: 'DR001', doctorName: 'Dr. Sarah Johnson', department: 'Cardiology', date: '2024-12-29T10:30:00', type: 'Check-up', status: 'scheduled', duration: 30, notes: 'Post-surgery recovery check', createdAt: '2024-12-19T14:00:00' },
    { id: 'APT007', patientId: 'PT009', patientName: 'Iris Taylor', doctorId: 'DR005', doctorName: 'Dr. Patricia Lee', department: 'Dermatology', date: '2024-12-29T14:00:00', type: 'Consultation', status: 'pending', duration: 30, notes: 'New patient consultation', createdAt: '2024-12-24T09:00:00' },
    { id: 'APT008', patientId: 'PT006', patientName: 'Frank Harris', doctorId: 'DR004', doctorName: 'Dr. James Wilson', department: 'Orthopedics', date: '2024-12-30T08:00:00', type: 'Follow-up', status: 'confirmed', duration: 30, notes: 'Knee injury follow-up', createdAt: '2024-12-22T16:00:00' },
    { id: 'APT009', patientId: 'PT008', patientName: 'Henry Wilson', doctorId: 'DR010', doctorName: 'Dr. William Anderson', department: 'Oncology', date: '2024-12-30T11:00:00', type: 'Check-up', status: 'confirmed', duration: 45, notes: 'Chemo follow-up', createdAt: '2024-12-20T10:00:00' },
    { id: 'APT010', patientId: 'PT010', patientName: 'Jack Davis', doctorId: 'DR004', doctorName: 'Dr. James Wilson', department: 'Orthopedics', date: '2024-12-30T14:30:00', type: 'Procedure', status: 'scheduled', duration: 60, notes: 'Joint injection', createdAt: '2024-12-21T13:00:00' },
    { id: 'APT011', patientId: 'PT011', patientName: 'Karen Moore', doctorId: 'DR009', doctorName: 'Dr. Jennifer Martinez', department: 'OB-GYN', date: '2024-12-31T09:00:00', type: 'Check-up', status: 'pending', duration: 30, notes: 'Annual check-up', createdAt: '2024-12-25T08:00:00' },
    { id: 'APT012', patientId: 'PT012', patientName: 'Leo Anderson', doctorId: 'DR001', doctorName: 'Dr. Sarah Johnson', department: 'Cardiology', date: '2024-12-31T10:30:00', type: 'Consultation', status: 'cancelled', duration: 30, notes: 'Patient cancelled', createdAt: '2024-12-23T11:00:00' }
  ],

  pharmacy: {
    medicines: [
      { id: 'MED001', name: 'Amoxicillin', category: 'Antibiotics', manufacturer: 'Pfizer', price: 15.99, unit: 'strip', stock: 500, minStock: 100, expiry: '2025-06-15', location: 'A-01', requiresPrescription: true, status: 'active' },
      { id: 'MED002', name: 'Ibuprofen', category: 'Pain Relief', manufacturer: 'Johnson & Johnson', price: 8.99, unit: 'bottle', stock: 300, minStock: 50, expiry: '2025-12-20', location: 'B-03', requiresPrescription: false, status: 'active' },
      { id: 'MED003', name: 'Atorvastatin', category: 'Cardiovascular', manufacturer: 'Merck', price: 22.50, unit: 'strip', stock: 200, minStock: 75, expiry: '2025-09-10', location: 'C-02', requiresPrescription: true, status: 'active' },
      { id: 'MED004', name: 'Metformin', category: 'Diabetes', manufacturer: 'Bristol Myers', price: 12.99, unit: 'strip', stock: 350, minStock: 100, expiry: '2025-08-05', location: 'D-01', requiresPrescription: true, status: 'active' },
      { id: 'MED005', name: 'Omeprazole', category: 'Gastrointestinal', manufacturer: 'AstraZeneca', price: 18.99, unit: 'strip', stock: 45, minStock: 50, expiry: '2025-05-30', location: 'E-01', requiresPrescription: true, status: 'active' },
      { id: 'MED006', name: 'Lisinopril', category: 'Cardiovascular', manufacturer: 'Novartis', price: 14.50, unit: 'strip', stock: 250, minStock: 75, expiry: '2025-11-15', location: 'C-04', requiresPrescription: true, status: 'active' },
      { id: 'MED007', name: 'Cetirizine', category: 'Allergy', manufacturer: 'GSK', price: 6.99, unit: 'strip', stock: 400, minStock: 50, expiry: '2026-01-20', location: 'F-02', requiresPrescription: false, status: 'active' },
      { id: 'MED008', name: 'Paracetamol', category: 'Pain Relief', manufacturer: 'Sanofi', price: 5.99, unit: 'strip', stock: 600, minStock: 100, expiry: '2026-03-10', location: 'B-01', requiresPrescription: false, status: 'active' },
      { id: 'MED009', name: 'Azithromycin', category: 'Antibiotics', manufacturer: 'Pfizer', price: 25.99, unit: 'strip', stock: 15, minStock: 50, expiry: '2025-04-15', location: 'A-03', requiresPrescription: true, status: 'active' },
      { id: 'MED010', name: 'Insulin Glargine', category: 'Diabetes', manufacturer: 'Novo Nordisk', price: 85.00, unit: 'vial', stock: 80, minStock: 30, expiry: '2025-07-22', location: 'D-03', requiresPrescription: true, status: 'active' },
      { id: 'MED011', name: 'Salbutamol', category: 'Respiratory', manufacturer: 'GSK', price: 11.50, unit: 'inhaler', stock: 120, minStock: 40, expiry: '2025-10-01', location: 'G-01', requiresPrescription: true, status: 'active' },
      { id: 'MED012', name: 'Warfarin', category: 'Anticoagulant', manufacturer: 'Bayer', price: 9.99, unit: 'strip', stock: 180, minStock: 50, expiry: '2025-08-30', location: 'C-05', requiresPrescription: true, status: 'active' }
    ],
    suppliers: [
      { id: 'SUP001', name: 'MedSupply Co.', contact: '(555) 200-0001', email: 'orders@medsupply.com', address: '500 Industrial Pkwy', status: 'active', rating: 4.5 },
      { id: 'SUP002', name: 'PharmaDirect', contact: '(555) 200-0002', email: 'sales@pharmadirect.com', address: '200 Commerce Blvd', status: 'active', rating: 4.2 },
      { id: 'SUP003', name: 'HealthMart Distributors', contact: '(555) 200-0003', email: 'info@healthmart.com', address: '750 Trade Center Dr', status: 'active', rating: 4.8 }
    ]
  },

  laboratory: {
    tests: [
      { id: 'LAB001', name: 'Complete Blood Count', category: 'Hematology', price: 45.00, turnaround: '2-4 hours', sampleType: 'Blood', preparation: 'Fasting required', status: 'active' },
      { id: 'LAB002', name: 'Basic Metabolic Panel', category: 'Chemistry', price: 55.00, turnaround: '4-6 hours', sampleType: 'Blood', preparation: 'Fasting required', status: 'active' },
      { id: 'LAB003', name: 'Lipid Panel', category: 'Chemistry', price: 65.00, turnaround: '6-8 hours', sampleType: 'Blood', preparation: 'Fasting 12 hours', status: 'active' },
      { id: 'LAB004', name: 'Urinalysis', category: 'Urinalysis', price: 25.00, turnaround: '1-2 hours', sampleType: 'Urine', preparation: 'Clean catch preferred', status: 'active' },
      { id: 'LAB005', name: 'Thyroid Panel', category: 'Hormones', price: 85.00, turnaround: '24 hours', sampleType: 'Blood', preparation: 'No special preparation', status: 'active' },
      { id: 'LAB006', name: 'Liver Function Test', category: 'Chemistry', price: 70.00, turnaround: '4-6 hours', sampleType: 'Blood', preparation: 'Fasting required', status: 'active' },
      { id: 'LAB007', name: 'HbA1c', category: 'Diabetes', price: 40.00, turnaround: '4-6 hours', sampleType: 'Blood', preparation: 'No fasting required', status: 'active' },
      { id: 'LAB008', name: 'COVID-19 RT-PCR', category: 'Microbiology', price: 120.00, turnaround: '24-48 hours', sampleType: 'Nasal Swab', preparation: 'No special preparation', status: 'active' },
      { id: 'LAB009', name: 'Vitamin D Test', category: 'Vitamins', price: 75.00, turnaround: '24-48 hours', sampleType: 'Blood', preparation: 'No special preparation', status: 'active' },
      { id: 'LAB010', name: 'Iron Studies', category: 'Hematology', price: 60.00, turnaround: '6-8 hours', sampleType: 'Blood', preparation: 'Fasting required', status: 'active' }
    ],
    labOrders: [
      { id: 'LO001', patientId: 'PT001', patientName: 'Alice Cooper', doctorId: 'DR001', doctorName: 'Dr. Sarah Johnson', testId: 'LAB001', testName: 'Complete Blood Count', orderedDate: '2024-12-20T09:00:00', status: 'completed', result: 'Normal', technician: 'Robert Kim', notes: '' },
      { id: 'LO002', patientId: 'PT002', patientName: 'Bob Martin', doctorId: 'DR002', doctorName: 'Dr. Michael Chen', testId: 'LAB003', testName: 'Lipid Panel', orderedDate: '2024-12-21T10:00:00', status: 'in_progress', result: null, technician: 'Robert Kim', notes: 'Priority processing' },
      { id: 'LO003', patientId: 'PT004', patientName: 'David Brown', doctorId: 'DR001', doctorName: 'Dr. Sarah Johnson', testId: 'LAB006', testName: 'Liver Function Test', orderedDate: '2024-12-22T11:00:00', status: 'completed', result: 'Elevated ALT/AST', technician: 'Robert Kim', notes: 'Repeat in 2 weeks' },
      { id: 'LO004', patientId: 'PT006', patientName: 'Frank Harris', doctorId: 'DR004', doctorName: 'Dr. James Wilson', testId: 'LAB010', testName: 'Iron Studies', orderedDate: '2024-12-23T08:00:00', status: 'pending', result: null, technician: null, notes: '' }
    ]
  },

  radiology: {
    exams: [
      { id: 'RAD001', name: 'Chest X-Ray', category: 'X-Ray', price: 150.00, preparation: 'No special preparation', duration: '15 min', status: 'active' },
      { id: 'RAD002', name: 'MRI Brain', category: 'MRI', price: 1200.00, preparation: 'Remove metal objects', duration: '45 min', status: 'active' },
      { id: 'RAD003', name: 'CT Abdomen', category: 'CT Scan', price: 800.00, preparation: 'Fasting 4 hours', duration: '30 min', status: 'active' },
      { id: 'RAD004', name: 'Ultrasound Pelvis', category: 'Ultrasound', price: 350.00, preparation: 'Full bladder required', duration: '30 min', status: 'active' },
      { id: 'RAD005', name: 'Mammogram', category: 'X-Ray', price: 200.00, preparation: 'No deodorant/perfume', duration: '20 min', status: 'active' },
      { id: 'RAD006', name: 'Bone Density Scan', category: 'DEXA', price: 175.00, preparation: 'No calcium supplements 24h prior', duration: '20 min', status: 'active' }
    ],
    radOrders: [
      { id: 'RO001', patientId: 'PT008', patientName: 'Henry Wilson', doctorId: 'DR010', doctorName: 'Dr. William Anderson', examId: 'RAD001', examName: 'Chest X-Ray', orderedDate: '2024-12-19T09:00:00', status: 'completed', result: 'Clear lungs', radiologist: 'Dr. Lisa Thompson' },
      { id: 'RO002', patientId: 'PT002', patientName: 'Bob Martin', doctorId: 'DR002', doctorName: 'Dr. Michael Chen', examId: 'RAD002', examName: 'MRI Brain', orderedDate: '2024-12-20T10:00:00', status: 'in_progress', result: null, radiologist: 'Dr. Lisa Thompson' },
      { id: 'RO003', patientId: 'PT012', patientName: 'Leo Anderson', doctorId: 'DR001', doctorName: 'Dr. Sarah Johnson', examId: 'RAD003', examName: 'CT Abdomen', orderedDate: '2024-12-21T11:00:00', status: 'scheduled', result: null, radiologist: null }
    ]
  },

  bloodBank: {
    inventory: [
      { id: 'BB001', bloodGroup: 'A+', units: 45, status: 'available', expiryDate: '2025-03-15', location: 'Freezer-1' },
      { id: 'BB002', bloodGroup: 'A-', units: 12, status: 'available', expiryDate: '2025-02-20', location: 'Freezer-1' },
      { id: 'BB003', bloodGroup: 'B+', units: 38, status: 'available', expiryDate: '2025-04-10', location: 'Freezer-2' },
      { id: 'BB004', bloodGroup: 'B-', units: 8, status: 'low', expiryDate: '2025-01-30', location: 'Freezer-2' },
      { id: 'BB005', bloodGroup: 'AB+', units: 15, status: 'available', expiryDate: '2025-03-22', location: 'Freezer-3' },
      { id: 'BB006', bloodGroup: 'AB-', units: 4, status: 'critical', expiryDate: '2025-02-05', location: 'Freezer-3' },
      { id: 'BB007', bloodGroup: 'O+', units: 60, status: 'available', expiryDate: '2025-05-01', location: 'Freezer-4' },
      { id: 'BB008', bloodGroup: 'O-', units: 20, status: 'available', expiryDate: '2025-03-28', location: 'Freezer-4' }
    ],
    donors: [
      { id: 'BD001', name: 'Tom Hardy', bloodGroup: 'O+', phone: '(555) 300-0001', lastDonation: '2024-10-15', totalDonations: 12, status: 'eligible', nextEligible: '2025-01-15' },
      { id: 'BD002', name: 'Sarah Palmer', bloodGroup: 'A+', phone: '(555) 300-0002', lastDonation: '2024-11-20', totalDonations: 8, status: 'eligible', nextEligible: '2025-02-20' },
      { id: 'BD003', name: 'Mike Ross', bloodGroup: 'B-', phone: '(555) 300-0003', lastDonation: '2024-09-01', totalDonations: 20, status: 'eligible', nextEligible: '2025-01-01' },
      { id: 'BD004', name: 'Rachel Zane', bloodGroup: 'AB+', phone: '(555) 300-0004', lastDonation: '2024-12-05', totalDonations: 5, status: 'eligible', nextEligible: '2025-03-05' }
    ],
    requests: [
      { id: 'BR001', patientId: 'PT004', patientName: 'David Brown', bloodGroup: 'AB+', units: 2, urgency: 'urgent', requestedBy: 'DR001', date: '2024-12-24', status: 'pending' },
      { id: 'BR002', patientId: 'PT012', patientName: 'Leo Anderson', bloodGroup: 'O+', units: 1, urgency: 'routine', requestedBy: 'DR004', date: '2024-12-23', status: 'fulfilled' }
    ]
  },

  wards: [
    { id: 'W001', name: 'General Ward A', type: 'General', floor: '2nd Floor', totalBeds: 30, occupiedBeds: 22, availableBeds: 8, status: 'active' },
    { id: 'W002', name: 'General Ward B', type: 'General', floor: '2nd Floor', totalBeds: 30, occupiedBeds: 28, availableBeds: 2, status: 'active' },
    { id: 'W003', name: 'Surgical Ward', type: 'Surgical', floor: '3rd Floor', totalBeds: 20, occupiedBeds: 15, availableBeds: 5, status: 'active' },
    { id: 'W004', name: 'Maternity Ward', type: 'Maternity', floor: '4th Floor', totalBeds: 15, occupiedBeds: 12, availableBeds: 3, status: 'active' },
    { id: 'W005', name: 'Pediatric Ward', type: 'Pediatric', floor: '4th Floor', totalBeds: 15, occupiedBeds: 8, availableBeds: 7, status: 'active' },
    { id: 'W006', name: 'Private Wing A', type: 'Private', floor: '5th Floor', totalBeds: 10, occupiedBeds: 7, availableBeds: 3, status: 'active' },
    { id: 'W007', name: 'Private Wing B', type: 'Private', floor: '5th Floor', totalBeds: 10, occupiedBeds: 10, availableBeds: 0, status: 'active' }
  ],

  beds: [
    { id: 'BED001', wardId: 'W001', bedNumber: 'A-01', status: 'occupied', patientId: 'PT001', patientName: 'Alice Cooper', assignedDate: '2024-12-20', notes: '' },
    { id: 'BED002', wardId: 'W001', bedNumber: 'A-02', status: 'occupied', patientId: 'PT004', patientName: 'David Brown', assignedDate: '2024-12-18', notes: 'Monitor BP' },
    { id: 'BED003', wardId: 'W001', bedNumber: 'A-03', status: 'available', patientId: null, patientName: null, assignedDate: null, notes: '' },
    { id: 'BED004', wardId: 'W001', bedNumber: 'A-04', status: 'occupied', patientId: 'PT008', patientName: 'Henry Wilson', assignedDate: '2024-12-19', notes: 'Oxygen support' },
    { id: 'BED005', wardId: 'W003', bedNumber: 'S-01', status: 'occupied', patientId: 'PT002', patientName: 'Bob Martin', assignedDate: '2024-12-21', notes: 'Post-surgery recovery' },
    { id: 'BED006', wardId: 'W003', bedNumber: 'S-02', status: 'maintenance', patientId: null, patientName: null, assignedDate: null, notes: 'Under maintenance' },
    { id: 'BED007', wardId: 'W004', bedNumber: 'M-01', status: 'occupied', patientId: 'PT011', patientName: 'Karen Moore', assignedDate: '2024-12-22', notes: 'Antenatal care' },
    { id: 'BED008', wardId: 'W005', bedNumber: 'P-01', status: 'occupied', patientId: 'PT003', patientName: 'Carol White', assignedDate: '2024-12-23', notes: 'Pediatric observation' }
  ],

  icu: {
    beds: [
      { id: 'ICU001', bedNumber: 'ICU-01', status: 'occupied', patientId: 'PT004', patientName: 'David Brown', admittedDate: '2024-12-18', condition: 'Critical', ventilator: true, vitals: { bp: '90/60', hr: 110, rr: 22, temp: 38.5, o2: 92 }, assignedNurse: 'Emily Davis', doctorId: 'DR001' },
      { id: 'ICU002', bedNumber: 'ICU-02', status: 'occupied', patientId: 'PT008', patientName: 'Henry Wilson', admittedDate: '2024-12-19', condition: 'Stable', ventilator: false, vitals: { bp: '130/85', hr: 76, rr: 16, temp: 37.1, o2: 97 }, assignedNurse: 'Emily Davis', doctorId: 'DR010' },
      { id: 'ICU003', bedNumber: 'ICU-03', status: 'available', patientId: null, patientName: null, admittedDate: null, condition: null, ventilator: false, vitals: null, assignedNurse: null, doctorId: null },
      { id: 'ICU004', bedNumber: 'ICU-04', status: 'reserved', patientId: null, patientName: null, admittedDate: null, condition: null, ventilator: false, vitals: null, assignedNurse: null, doctorId: null }
    ],
    equipment: [
      { id: 'EQ001', name: 'Ventilator', total: 8, available: 3, inUse: 5, status: 'operational' },
      { id: 'EQ002', name: 'Defibrillator', total: 4, available: 2, inUse: 2, status: 'operational' },
      { id: 'EQ003', name: 'Infusion Pump', total: 12, available: 5, inUse: 7, status: 'operational' },
      { id: 'EQ004', name: 'Patient Monitor', total: 10, available: 4, inUse: 6, status: 'operational' }
    ]
  },

  emergency: {
    cases: [
      { id: 'ER001', patientName: 'Mark Johnson', age: 45, gender: 'M', complaint: 'Chest pain', triage: 'critical', status: 'in_treatment', arrivalTime: '2024-12-28T02:30:00', doctorId: 'DR006', doctorName: 'Dr. David Thompson', vitals: { bp: '80/50', hr: 130, rr: 28, temp: 37.0, o2: 88 } },
      { id: 'ER002', patientName: 'Nancy Drew', age: 28, gender: 'F', complaint: 'Fractured ankle', triage: 'moderate', status: 'waiting', arrivalTime: '2024-12-28T04:15:00', doctorId: 'DR004', doctorName: 'Dr. James Wilson', vitals: { bp: '120/80', hr: 85, rr: 18, temp: 36.8, o2: 99 } },
      { id: 'ER003', patientName: 'Oliver Stone', age: 62, gender: 'M', complaint: 'Shortness of breath', triage: 'critical', status: 'in_treatment', arrivalTime: '2024-12-28T03:45:00', doctorId: 'DR006', doctorName: 'Dr. David Thompson', vitals: { bp: '160/95', hr: 105, rr: 26, temp: 37.5, o2: 90 } },
      { id: 'ER004', patientName: 'Paula Adams', age: 7, gender: 'F', complaint: 'High fever', triage: 'moderate', status: 'waiting', arrivalTime: '2024-12-28T05:00:00', doctorId: 'DR003', doctorName: 'Dr. Emily Rodriguez', vitals: { bp: '100/65', hr: 110, rr: 22, temp: 39.2, o2: 97 } },
      { id: 'ER005', patientName: 'Quinn Baker', age: 35, gender: 'M', complaint: 'Laceration - left arm', triage: 'minor', status: 'discharged', arrivalTime: '2024-12-28T01:00:00', doctorId: 'DR006', doctorName: 'Dr. David Thompson', vitals: { bp: '125/80', hr: 72, rr: 16, temp: 36.9, o2: 100 } }
    ],
    stats: { totalToday: 24, critical: 2, moderate: 8, minor: 14, avgWaitTime: '18 min', peakHours: '10AM-2PM & 6PM-10PM' }
  },

  operationTheater: {
    theaters: [
      { id: 'OT001', name: 'OT-1', type: 'General Surgery', status: 'in_use', currentSurgery: 'Appendectomy', patientName: 'Bob Martin', surgeon: 'Dr. James Wilson', startTime: '2024-12-28T08:00:00', estimatedEnd: '2024-12-28T09:30:00', cleanupTime: 30 },
      { id: 'OT002', name: 'OT-2', type: 'Cardiac Surgery', status: 'available', currentSurgery: null, patientName: null, surgeon: null, startTime: null, estimatedEnd: null, cleanupTime: 45 },
      { id: 'OT003', name: 'OT-3', type: 'Orthopedic Surgery', status: 'scheduled', currentSurgery: 'Knee Replacement', patientName: 'Jack Davis', surgeon: 'Dr. James Wilson', startTime: '2024-12-28T14:00:00', estimatedEnd: '2024-12-28T16:30:00', cleanupTime: 30 },
      { id: 'OT004', name: 'OT-4', type: 'Emergency', status: 'in_use', currentSurgery: 'Emergency Craniotomy', patientName: 'Mark Johnson', surgeon: 'Dr. Michael Chen', startTime: '2024-12-28T03:00:00', estimatedEnd: '2024-12-28T06:00:00', cleanupTime: 60 }
    ],
    schedule: [
      { id: 'OS001', otId: 'OT001', patientName: 'Bob Martin', surgeon: 'Dr. James Wilson', procedure: 'Appendectomy', date: '2024-12-28', startTime: '08:00', estimatedDuration: 90, status: 'in_progress' },
      { id: 'OS002', otId: 'OT003', patientName: 'Jack Davis', surgeon: 'Dr. James Wilson', procedure: 'Knee Replacement', date: '2024-12-28', startTime: '14:00', estimatedDuration: 150, status: 'scheduled' },
      { id: 'OS003', otId: 'OT001', patientName: 'Iris Taylor', surgeon: 'Dr. Sarah Johnson', procedure: 'Angioplasty', date: '2024-12-29', startTime: '09:00', estimatedDuration: 120, status: 'scheduled' }
    ]
  },

  nurseStation: {
    shifts: [
      { id: 'NS001', nurseName: 'Emily Davis', department: 'ICU', shift: 'Day (7AM-3PM)', date: '2024-12-28', status: 'on_duty' },
      { id: 'NS002', nurseName: 'Rachel Green', department: 'Emergency', shift: 'Night (11PM-7AM)', date: '2024-12-28', status: 'on_duty' },
      { id: 'NS003', nurseName: 'Monica Geller', department: 'Surgical Ward', shift: 'Evening (3PM-11PM)', date: '2024-12-28', status: 'on_duty' },
      { id: 'NS004', nurseName: 'Phoebe Buffay', department: 'Pediatrics', shift: 'Day (7AM-3PM)', date: '2024-12-28', status: 'off_duty' }
    ],
    tasks: [
      { id: 'NT001', patientName: 'David Brown', task: 'Administer IV antibiotics', priority: 'high', assignedTo: 'Emily Davis', status: 'pending', time: '08:00' },
      { id: 'NT002', patientName: 'Henry Wilson', task: 'Change wound dressing', priority: 'medium', assignedTo: 'Emily Davis', status: 'completed', time: '07:30' },
      { id: 'NT003', patientName: 'Alice Cooper', task: 'Check vital signs', priority: 'routine', assignedTo: 'Monica Geller', status: 'in_progress', time: '08:00' }
    ]
  },

  staff: [
    { id: 'ST001', name: 'Amanda Taylor', department: 'Human Resources', role: 'HR Manager', email: 'amanda.t@medicore.com', phone: '(555) 400-0001', joinDate: '2020-03-01', salary: 85000, status: 'active', emergencyContact: '(555) 400-0001' },
    { id: 'ST002', name: 'Brian Foster', department: 'IT', role: 'System Administrator', email: 'brian.f@medicore.com', phone: '(555) 400-0002', joinDate: '2021-06-15', salary: 75000, status: 'active', emergencyContact: '(555) 400-0002' },
    { id: 'ST003', name: 'Catherine Hayes', department: 'Administration', role: 'Administrative Assistant', email: 'catherine.h@medicore.com', phone: '(555) 400-0003', joinDate: '2022-09-01', salary: 45000, status: 'active', emergencyContact: '(555) 400-0003' },
    { id: 'ST004', name: 'Daniel Ortiz', department: 'Maintenance', role: 'Facility Manager', email: 'daniel.o@medicore.com', phone: '(555) 400-0004', joinDate: '2019-11-20', salary: 55000, status: 'active', emergencyContact: '(555) 400-0004' },
    { id: 'ST005', name: 'Fiona Walsh', department: 'Finance', role: 'Accountant', email: 'fiona.w@medicore.com', phone: '(555) 400-0005', joinDate: '2020-07-10', salary: 62000, status: 'active', emergencyContact: '(555) 400-0005' },
    { id: 'ST006', name: 'George Turner', department: 'Security', role: 'Security Officer', email: 'george.t@medicore.com', phone: '(555) 400-0006', joinDate: '2023-01-05', salary: 38000, status: 'active', emergencyContact: '(555) 400-0006' }
  ],

  attendance: [
    { id: 'AT001', staffId: 'ST001', date: '2024-12-23', checkIn: '08:45', checkOut: '17:15', status: 'present', hours: 8.5 },
    { id: 'AT002', staffId: 'ST002', date: '2024-12-23', checkIn: '09:00', checkOut: '17:30', status: 'present', hours: 8.5 },
    { id: 'AT003', staffId: 'ST003', date: '2024-12-23', checkIn: '08:30', checkOut: '16:45', status: 'present', hours: 8.25 },
    { id: 'AT004', staffId: 'ST004', date: '2024-12-23', checkIn: null, checkOut: null, status: 'leave', hours: 0 },
    { id: 'AT005', staffId: 'ST001', date: '2024-12-24', checkIn: '09:00', checkOut: '17:00', status: 'present', hours: 8 },
    { id: 'AT006', staffId: 'ST002', date: '2024-12-24', checkIn: '09:15', checkOut: null, status: 'late', hours: 0 },
    { id: 'AT007', staffId: 'ST005', date: '2024-12-24', checkIn: null, checkOut: null, status: 'absent', hours: 0 }
  ],

  billing: [
    { id: 'BIL001', patientId: 'PT001', patientName: 'Alice Cooper', date: '2024-12-20', amount: 450.00, paid: 450.00, due: 0, items: [{ description: 'Consultation - Cardiology', amount: 200 }, { description: 'CBC Test', amount: 45 }, { description: 'Medication - Amoxicillin', amount: 15.99 }, { description: 'Room Charge (2 days)', amount: 189.01 }], status: 'paid' },
    { id: 'BIL002', patientId: 'PT002', patientName: 'Bob Martin', date: '2024-12-21', amount: 1250.00, paid: 500.00, due: 750.00, items: [{ description: 'MRI Brain', amount: 1200 }, { description: 'Consultation - Neurology', amount: 50 }], status: 'partial' },
    { id: 'BIL003', patientId: 'PT004', patientName: 'David Brown', date: '2024-12-22', amount: 3200.00, paid: 0, due: 3200.00, items: [{ description: 'ICU - 3 Days', amount: 2400 }, { description: 'Ventilator Support', amount: 500 }, { description: 'Medication', amount: 300 }], status: 'unpaid' },
    { id: 'BIL004', patientId: 'PT008', patientName: 'Henry Wilson', date: '2024-12-19', amount: 1800.00, paid: 1800.00, due: 0, items: [{ description: 'Chemotherapy Session', amount: 1000 }, { description: 'Chest X-Ray', amount: 150 }, { description: 'Lab Tests', amount: 200 }, { description: 'Room Charge', amount: 450 }], status: 'paid' },
    { id: 'BIL005', patientId: 'PT003', patientName: 'Carol White', date: '2024-12-23', amount: 175.00, paid: 175.00, due: 0, items: [{ description: 'Pediatric Consultation', amount: 180 }], status: 'paid' }
  ],

  insurance: [
    { id: 'INS001', provider: 'BlueCross BlueShield', planType: 'PPO', policyHolder: 'Alice Cooper', policyNumber: 'BC-12345', startDate: '2024-01-01', endDate: '2024-12-31', coverage: 80, copay: 25, deductible: 1000, maxOutOfPocket: 5000, status: 'active' },
    { id: 'INS002', provider: 'Aetna', planType: 'HMO', policyHolder: 'Bob Martin', policyNumber: 'AE-67890', startDate: '2024-03-01', endDate: '2024-12-31', coverage: 70, copay: 30, deductible: 1500, maxOutOfPocket: 6000, status: 'active' },
    { id: 'INS003', provider: 'Cigna', planType: 'PPO', policyHolder: 'Carol White', policyNumber: 'CG-13579', startDate: '2024-02-01', endDate: '2024-12-31', coverage: 85, copay: 20, deductible: 750, maxOutOfPocket: 4000, status: 'active' },
    { id: 'INS004', provider: 'Medicare', planType: 'Government', policyHolder: 'David Brown', policyNumber: 'MC-24680', startDate: '2023-01-01', endDate: '2024-12-31', coverage: 80, copay: 15, deductible: 500, maxOutOfPocket: 3500, status: 'active' }
  ],

  notifications: [
    { id: 'NOT001', type: 'emergency', message: 'Critical patient arriving - Code Blue', time: new Date(Date.now() - 300000).toISOString(), read: false },
    { id: 'NOT002', type: 'appointment', message: 'Dr. Johnson\'s 9AM patient arrived', time: new Date(Date.now() - 600000).toISOString(), read: false },
    { id: 'NOT003', type: 'lab', message: 'Lab results for Bob Martin ready', time: new Date(Date.now() - 1800000).toISOString(), read: false },
    { id: 'NOT004', type: 'pharmacy', message: 'Low stock alert: Azithromycin', time: new Date(Date.now() - 3600000).toISOString(), read: false },
    { id: 'NOT005', type: 'billing', message: 'Payment received from Alice Cooper', time: new Date(Date.now() - 7200000).toISOString(), read: true },
    { id: 'NOT006', type: 'system', message: 'System backup completed successfully', time: new Date(Date.now() - 14400000).toISOString(), read: true },
    { id: 'NOT007', type: 'blood_bank', message: 'Blood donation camp scheduled for Jan 15', time: new Date(Date.now() - 28800000).toISOString(), read: true },
    { id: 'NOT008', type: 'staff', message: 'Staff meeting at 3PM in Conference Room A', time: new Date(Date.now() - 43200000).toISOString(), read: true }
  ],

  activities: [
    { id: 'ACT001', user: 'Dr. Sarah Johnson', action: 'completed appointment', target: 'Alice Cooper', time: new Date(Date.now() - 600000).toISOString(), type: 'appointment' },
    { id: 'ACT002', user: 'John Smith', action: 'registered new patient', target: 'Iris Taylor', time: new Date(Date.now() - 1800000).toISOString(), type: 'registration' },
    { id: 'ACT003', user: 'Robert Kim', action: 'completed lab test', target: 'David Brown - Liver Function', time: new Date(Date.now() - 3600000).toISOString(), type: 'lab' },
    { id: 'ACT004', user: 'Lisa Wang', action: 'dispensed medication', target: 'Amoxicillin to Alice Cooper', time: new Date(Date.now() - 5400000).toISOString(), type: 'pharmacy' },
    { id: 'ACT005', user: 'Dr. James Wilson', action: 'performed surgery', target: 'Appendectomy - Bob Martin', time: new Date(Date.now() - 7200000).toISOString(), type: 'surgery' },
    { id: 'ACT006', user: 'Emily Davis', action: 'updated vital signs', target: 'ICU - David Brown', time: new Date(Date.now() - 9000000).toISOString(), type: 'nursing' },
    { id: 'ACT007', user: 'Fiona Walsh', action: 'processed payment', target: 'Alice Cooper - $450', time: new Date(Date.now() - 10800000).toISOString(), type: 'billing' }
  ]
};
