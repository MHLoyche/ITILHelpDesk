import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Article, ArticleService } from "../../services/articles";

@Component({
  selector: "app-article-detail",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./article-detail.html",
  styleUrl: "./article-detail.css",
})
export class ArticleDetail implements OnInit {
  article = signal<Article | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    if (!id) {
      this.error.set("Invalid article id");
      this.loading.set(false);
      return;
    }

    this.articleService.getArticleById(id).subscribe({
      next: (data) => {
        this.article.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Failed to load article");
        this.loading.set(false);
      },
    });
  }
}