"""Prepare lightweight web media from the original DDC demo assets."""

from __future__ import annotations

import argparse
import shutil
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / "website"
SOURCE_DEMOS = ROOT / "02_TRIM_4K"
ASSEMBLE = ROOT / "03_ASSEMBLE"

DEMO_FILES = [
    "shot2_A_left7882_08315_214000.mp4",
    "shot1_A_right6757_083155_165000.mp4",
    "shot4_A_left4086_083155_214000.mp4",
    "shot16_A_083155_170000.mp4",
    "shot7_A_083155_170000.mp4",
    "shot17_A_083155_170000.mp4",
    "shot8_A_083155_170000.mp4",
    "shot18_A_083155_170000.mp4",
    "shot14_A_083155_170000.mp4",
    "shot22_A_0718_271000.mp4",
    "shot15_A_083155_170000.mp4",
    "shot32_A_right9402_083155_170000.mp4",
    "shot29_A_left2209_083155_170000(noise).mp4",
    "shot47_A_right4541_083155_165000.mp4",
    "shot38_A_left3006_0718_177000.mp4",
    "shot51_A_right8241_083155_165000.mp4",
    "shot39_A_left6206_0718_177000.mp4",
    "shot52_A_right9402_083155_165000.mp4",
    "shot40_A_left8031_0718_177000.mp4",
    "shot63_A_right5664_083155_170000.mp4",
    "shot41_A_left8855_083155_165000.mp4",
    "shot64_A_right2391_083155_170000.mp4",
    "shot45_A_left3081_083155_165000.mp4",
    "shot69_A_right6343_0718_271000.mp4",
    "shot70_A_right4410_083155_208000.mp4",
]


def run_ffmpeg(args: list[str], target: Path, force: bool) -> None:
    if target.exists() and not force:
        print(f"skip  {target.name}")
        return
    target.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args], check=True)
    print(f"wrote {target.relative_to(SITE)}")


def prepare(force: bool) -> None:
    missing = [name for name in DEMO_FILES if not (SOURCE_DEMOS / name).exists()]
    if missing:
        raise FileNotFoundError(f"Missing source demos: {missing}")

    media = SITE / "public" / "media"
    demo_dir = media / "demos"
    hd_dir = media / "demos-hd"
    poster_dir = media / "posters"
    media.mkdir(parents=True, exist_ok=True)

    film_source = ASSEMBLE / "whole_part_v1" / "whole_part_v1.mp4"
    film_target = media / "fddc-film.mp4"
    run_ffmpeg(
        [
            "-i", str(film_source),
            "-vf", "scale=960:720:flags=lanczos,fps=24",
            "-c:v", "libx264", "-preset", "medium",
            "-b:v", "1200k", "-maxrate", "1600k", "-bufsize", "2400k",
            "-c:a", "aac", "-b:a", "64k",
            "-movflags", "+faststart",
            str(film_target),
        ],
        film_target,
        force,
    )

    cover_source = ASSEMBLE / "whole_part_v1" / "whole_part_v1-封面.jpg"
    cover_target = media / "fddc-poster.webp"
    run_ffmpeg(
        ["-i", str(cover_source), "-vf", "scale=1200:900:flags=lanczos", "-frames:v", "1", "-quality", "78", str(cover_target)],
        cover_target,
        force,
    )

    for index, filename in enumerate(DEMO_FILES, start=1):
        source = SOURCE_DEMOS / filename
        video_target = demo_dir / f"demo-{index:02d}.mp4"
        hd_target = hd_dir / f"demo-{index:02d}.mp4"
        poster_target = poster_dir / f"demo-{index:02d}.webp"
        crop = "crop=ih*4/3:ih:(iw-ih*4/3)/2:0,scale=640:480:flags=lanczos,fps=24"

        run_ffmpeg(
            [
                "-i", str(source), "-vf", crop,
                "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "30",
                "-movflags", "+faststart", "-pix_fmt", "yuv420p",
                str(video_target),
            ],
            video_target,
            force,
        )
        run_ffmpeg(
            [
                "-i", str(source),
                "-vf", "crop=ih*4/3:ih:(iw-ih*4/3)/2:0,scale=1440:1080:flags=lanczos,fps=30",
                "-c:v", "libx264", "-preset", "medium", "-crf", "24",
                "-c:a", "aac", "-b:a", "96k",
                "-movflags", "+faststart", "-pix_fmt", "yuv420p",
                str(hd_target),
            ],
            hd_target,
            force,
        )
        run_ffmpeg(
            [
                "-ss", "1", "-i", str(source),
                "-vf", "crop=ih*4/3:ih:(iw-ih*4/3)/2:0,scale=960:720:flags=lanczos",
                "-frames:v", "1", "-quality", "78", str(poster_target),
            ],
            poster_target,
            force,
        )

    figure_source = ASSEMBLE / "fig1_overview_4x3.svg"
    figure_target = media / "method-overview.svg"
    if force or not figure_target.exists():
        shutil.copy2(figure_source, figure_target)
        print(f"wrote {figure_target.relative_to(SITE)}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="overwrite existing outputs")
    prepare(parser.parse_args().force)
