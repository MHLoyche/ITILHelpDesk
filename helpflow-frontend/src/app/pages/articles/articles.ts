import { Component, OnInit, signal, computed } from "@angular/core";
import { ArticleService, Article } from "../../services/articles";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-articles",
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: "./articles.html",
  styleUrl: "./articles.css",
})
export class Articles implements OnInit {
  articles = signal<Article[]>([]);
  searchTerm = signal("");
  loading = signal(true);
  error = signal<string | null>(null);

  filteredArticles = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.articles();

    return this.articles().filter((article) => {
      const title = article.title.toLowerCase();
      const category = (article.categoryName || "Uncategorized").toLowerCase();
      return title.includes(term) || category.includes(term);
    });
  });

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articleService.getArticles().subscribe({
      next: (data) => {
        this.articles.set(data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Failed to load articles");
        this.loading.set(false);
      },
    });
  }
}