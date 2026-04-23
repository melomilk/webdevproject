import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, GalleryItem } from '../../services/api';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery implements OnInit {
  private api = inject(ApiService);

  allItems = signal<GalleryItem[]>([]);
  loading = signal(true);
  error = signal('');
  
  selectedMasterId = signal<number | null>(null);

  uniqueMasters = computed(() => {
    const seen = new Set<number>();
    const result: { id: number; name: string }[] = [];
    for (const item of this.allItems()) {
      if (!seen.has(item.master_id)) {
        seen.add(item.master_id);
        result.push({ id: item.master_id, name: item.master_name });
      }
    }
    return result;
  });

  filteredItems = computed(() => {
    const selected = this.selectedMasterId();
    if (selected === null) return this.allItems();
    return this.allItems().filter(item => item.master_id === selected);
  });

  ngOnInit() {
    this.loadGallery();
  }

  loadGallery() {
    this.api.getAllGallery().subscribe({
      next: (data) => {
        this.allItems.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Failed to load gallery.');
        console.error(err);
      },
    });
  }

  selectMaster(id: number | null) {
    this.selectedMasterId.set(id);
  }

  getImageUrl(relativeUrl: string): string {
    if (relativeUrl.startsWith('http')) return relativeUrl;
    return `http://localhost:8000${relativeUrl}`;
  }
}