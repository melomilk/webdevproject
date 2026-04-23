import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Master, Booking, GalleryItem } from '../../services/api';

@Component({
  selector: 'app-master-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './master-portfolio.html',
  styleUrl: './master-portfolio.css',
})
export class MasterPortfolio implements OnInit {
  private api = inject(ApiService);

  profile = signal<Master | null>(null);
  bookings = signal<Booking[]>([]);
  gallery = signal<GalleryItem[]>([]);
  loading = signal(true);
  error = signal('');
  
  // Profile edit mode
  editing = signal(false);
  editForm = {
    name: '',
    specialty: '',
    bio: '',
  };
  saveMessage = signal('');

  // Gallery upload state
  selectedFile: File | null = null;
  uploadDescription = '';
  uploading = signal(false);
  uploadError = signal('');
  
  // Gallery edit state
  editingGalleryId = signal<number | null>(null);
  galleryEditDescription = '';

  ngOnInit() {
    this.loadProfile();
    this.loadBookings();
    this.loadGallery();
  }

  loadProfile() {
    this.api.getMyMasterProfile().subscribe({
      next: (data) => {
        this.profile.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 403) this.error.set('Access denied — masters only.');
        else if (err.status === 404) this.error.set('Your account is not linked to a master profile. Please contact admin.');
        else this.error.set('Failed to load profile.');
      },
    });
  }

  loadBookings() {
    this.api.getMyMasterBookings().subscribe({
      next: (data) => this.bookings.set(data),
      error: (err) => console.error('Bookings load error:', err),
    });
  }

  loadGallery() {
    const p = this.profile();
    if (p) {
      this.loadGalleryForMaster(p.id);
    } else {
      // Ждём пока profile загрузится — используем getAllGallery и фильтруем
      this.api.getAllGallery().subscribe({
        next: (data) => {
          const my = this.profile();
          if (my) this.gallery.set(data.filter(item => item.master_id === my.id));
        },
        error: (err) => console.error('Gallery load error:', err),
      });
    }
  }

  private loadGalleryForMaster(masterId: number) {
    this.api.getMasterGallery(masterId).subscribe({
      next: (data) => this.gallery.set(data),
      error: (err) => console.error('Gallery load error:', err),
    });
  }

  // PROFILE EDITING
  startEditing() {
    const p = this.profile();
    if (!p) return;
    this.editForm = { name: p.name, specialty: p.specialty, bio: p.bio || '' };
    this.editing.set(true);
    this.saveMessage.set('');
  }

  cancelEditing() {
    this.editing.set(false);
    this.saveMessage.set('');
  }

  saveProfile() {
    this.api.updateMyMasterProfile(this.editForm).subscribe({
      next: (updated) => {
        this.profile.set(updated);
        this.editing.set(false);
        this.saveMessage.set('Profile updated!');
        setTimeout(() => this.saveMessage.set(''), 3000);
      },
      error: (err) => {
        this.saveMessage.set('Failed to save.');
      },
    });
  }

  // GALLERY UPLOAD
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadWork() {
    if (!this.selectedFile) {
      this.uploadError.set('Please select a file first.');
      return;
    }
    
    this.uploading.set(true);
    this.uploadError.set('');
    
    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('description', this.uploadDescription);
    
    this.api.uploadGalleryItem(formData).subscribe({
      next: (newItem) => {
        // Add new item to the top of the list
        this.gallery.update(current => [newItem, ...current]);
        this.selectedFile = null;
        this.uploadDescription = '';
        this.uploading.set(false);
        // Clear file input
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      error: (err) => {
        this.uploading.set(false);
        this.uploadError.set('Failed to upload. Try a smaller image.');
        console.error('Upload error:', err);
      },
    });
  }

  // GALLERY EDIT DESCRIPTION
  startEditingGallery(item: GalleryItem) {
    this.editingGalleryId.set(item.id);
    this.galleryEditDescription = item.description;
  }

  cancelEditingGallery() {
    this.editingGalleryId.set(null);
    this.galleryEditDescription = '';
  }

  saveGalleryEdit(id: number) {
    this.api.updateGalleryItem(id, { description: this.galleryEditDescription }).subscribe({
      next: (updated) => {
        this.gallery.update(current => 
          current.map(item => item.id === id ? updated : item)
        );
        this.editingGalleryId.set(null);
      },
      error: () => alert('Failed to update.'),
    });
  }

  // GALLERY DELETE
  deleteWork(id: number) {
    if (!confirm('Delete this work? This cannot be undone.')) return;
    
    this.api.deleteGalleryItem(id).subscribe({
      next: () => {
        this.gallery.update(current => current.filter(item => item.id !== id));
      },
      error: () => alert('Failed to delete.'),
    });
  }

  // Helper for building full image URLs
  getImageUrl(relativeUrl: string): string {
    if (relativeUrl.startsWith('http')) return relativeUrl;
    return `http://localhost:8000${relativeUrl}`;
  }
}