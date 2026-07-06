document.addEventListener('DOMContentLoaded', () => {
    // --- STICKY HEADER ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- MOBILE MENU ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- SMOKE PARTICLES SYSTEM ---
    const canvas = document.getElementById('smoke-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 45;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
            // Start at random y positions initially to avoid empty screen at start
            this.y = Math.random() * canvas.height;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 50;
            this.size = Math.random() * 80 + 40; // thick cloud particles
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = -(Math.random() * 0.5 + 0.2); // upward drift
            this.alpha = 0;
            this.maxAlpha = Math.random() * 0.12 + 0.03; // very faint transparency
            this.life = 0;
            this.decayRate = Math.random() * 0.0005 + 0.0002;
            
            // Subtle Amber-gold smoke colors
            const colors = [
                '212, 175, 55', // Gold
                '229, 169, 59', // Amber
                '40, 30, 20'    // Deep Warm Brownish Smoke
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Fade-in at start, Fade-out at end of life
            if (this.y < canvas.height * 0.8) {
                this.alpha -= this.decayRate * 5;
            } else if (this.alpha < this.maxAlpha) {
                this.alpha += 0.002;
            }

            if (this.alpha <= 0 || this.y < -this.size) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size
            );
            gradient.addColorStop(0, `rgba(${this.color}, ${this.alpha})`);
            gradient.addColorStop(0.5, `rgba(${this.color}, ${this.alpha * 0.3})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();

    // --- OLFACTORY PROFILE EXPLORER ---
    const noteData = {
        leather: {
            title: "Дорогая кожа (Leather)",
            text: "Нота дорогой кожи — это основа моего вкуса. Это запах благородной замши, грубого ремня или салона элитного авто. В парфюмерии он воссоздается с помощью березового дегтя, изобутилхинолина или лабданума. Звучит сухо, брутально, с легким оттенком дыма, дегтя и тепла. Ароматы кожи не про кокетство, они про внутренний стержень и уверенность."
        },
        resins: {
            title: "Густые смолы (Resins)",
            text: "Мир смол — ладан, бензоин, мирра, опопонакс. Это густые, бальзамические, сладковато-пряные ароматы с церковными, мистическими или даже медитативными оттенками. Они придают композициям плотность, невероятную глубину, делают парфюм тягучим, согревающим и по-настоящему объемным."
        },
        wood: {
            title: "Благородное дерево (Wood)",
            text: "Кедр, сандал, ветивер и пачули. Древесные ноты создают прочный сухой скелет композиции. Это может быть сливочно-кремовый сандал, сухой карандашный кедр или влажно-землистые пачули. Они заземляют аромат, убирают излишнюю сладость и оставляют благородное ощущение лесной тишины."
        },
        oud: {
            title: "Мистический уд (Oud)",
            text: "Уд (агаровое дерево) — один из самых дорогих и многогранных компонентов. Он может звучать анималистично, медицински, дымно, сладко или кисловато. Это сложный компонент, требующий понимания. Уд обладает невероятным гипнотическим шлейфом и является жемчужиной восточной парфюмерии."
        },
        saffron: {
            title: "Пряный шафран (Saffron)",
            text: "Золото специй. Шафран привносит в парфюмерию горьковато-сладкий, кожано-йодистый, пряный и слегка металлический оттенок. Он идеально обрамляет розу, кожу и уд. Шафран добавляет ароматам ольфакторный блеск, дорогое звучание и дерзкий восточный колорит."
        }
    };

    const noteItems = document.querySelectorAll('.note-item');
    const noteDetailTitle = document.getElementById('note-detail-title');
    const noteDetailText = document.getElementById('note-detail-text');

    function selectNote(noteKey) {
        noteItems.forEach(item => {
            if (item.getAttribute('data-note') === noteKey) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        const data = noteData[noteKey];
        if (data) {
            noteDetailTitle.textContent = data.title;
            noteDetailText.textContent = data.text;
            
            // Subtle text reveal animation
            noteDetailTitle.style.animation = 'none';
            noteDetailText.style.animation = 'none';
            // Trigger reflow
            noteDetailTitle.offsetHeight;
            noteDetailTitle.style.animation = 'fadeInUp 0.5s ease forwards';
            noteDetailText.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    }

    noteItems.forEach(item => {
        item.addEventListener('click', () => {
            const noteKey = item.getAttribute('data-note');
            selectNote(noteKey);
        });
    });

    // Select leather by default
    selectNote('leather');

    // --- ANIMATING STATS COUNTERS ---
    const statsSection = document.getElementById('stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    function startCounting(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (target === 0) {
            el.textContent = '0';
            return;
        }

        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quad
            const easeProgress = progress * (2 - progress);
            const value = Math.floor(easeProgress * target);
            
            el.textContent = value;

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(updateNumber);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                statNumbers.forEach(num => startCounting(num));
                animated = true;
            }
        });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);

    // --- ARTICLES DATABASE ---
    const articlesDB = [
        {
            id: 1,
            category: "stories",
            badge: "История",
            date: "Июнь 2026",
            readTime: "6 мин",
            title: "В поисках «Comandor»: почему шедевры уходят в историю?",
            description: "Воспоминание об отцовском аромате Dzintars \"Comandor\" и расследование о том, можно ли воссоздать легендарные формулы ушедших эпох.",
            content: `
                <div class="article-header">
                    <span class="article-meta">История • Июнь 2026 • 6 мин</span>
                    <h1 class="article-title">В поисках «Comandor»: почему легендарные формулы уходят в историю?</h1>
                </div>
                <div class="article-body">
                    <p>У каждого из нас есть запахи, которые действуют как машина времени. Для меня такой триггер — советский рижский одеколон <strong>Dzintars "Comandor"</strong>. По особым праздникам отец разрешал мне, пацану, пользоваться этим тяжелым стеклянным флаконом. Это был строгий, мужественный запах: горькая полынь, смолистая сосна, сухой мох и благородная кожа.</p>
                    
                    <p>Прошли годы. В моей коллекции скопилось более двухсот флаконов, среди которых есть дорогой европейский люкс, изысканная селективная ниша и тяжелый арабский восток. Но того самого «призрака детства» я так и не нашел. Почему современная индустрия не способна воссоздать ароматы из нашего прошлого?</p>

                    <h3>Удар по палитре: ограничения IFRA</h3>
                    <p>Первая и главная причина — Международная парфюмерная ассоциация (IFRA). С каждым годом список запрещенных или жестко ограниченных ингредиентов растет. Натуральный дубовый мох (основа всех классических шипров и фужеров), животные мускусы, определенные виды смол и эфирных масел теперь под запретом из-за потенциальной аллергенности.</p>
                    <blockquote>
                        «Мы заменили природные шедевры безопасной синтетикой. И хотя синтетические молекулы дают парфюмеру невероятный простор для творчества, они часто лишены той грязной, живой харизмы, которая отличала ароматы XX века.»
                    </blockquote>

                    <h3>Маркетинг против искусства</h3>
                    <p>Современный рынок требует скорости. Крупные бренды выпускают по 10 фланкеров в год. Никто не ждет созревания парфюмерного концентрата месяцами. Все оптимизируется ради удешевления производства и ускорения продаж. Создавать сложные, бескомпромиссные ароматы, требующие времени на разнос и понимание, корпорациям экономически невыгодно.</p>

                    <h3>Где искать альтернативу?</h3>
                    <p>Если вы, как и я, ищете тот самый дух старой школы — сухой, кожаный, бескомпромиссно древесный, то смотреть нужно не в сторону современного сетевого люкса. Обратите внимание на инди-парфюмерию, небольшие артизанальные бренды, которые могут позволить себе игнорировать правила IFRA (выпускаемые малыми тиражами), или на глубокую арабскую нишу, где парфюмеры всё еще используют концентрированные масла и смолы.</p>
                    <p>Поиски идеального фужера продолжаются. Но именно этот вечный поиск и делает наше увлечение парфюмерией таким захватывающим.</p>
                </div>
            `
        },
        {
            id: 2,
            category: "reviews",
            badge: "Обзор",
            date: "Май 2026",
            readTime: "8 мин",
            title: "Арабский восток: парфюмерные сокровища за скромный бюджет",
            description: "Честный разбор арабских брендов: где скрываются шедевры, способные потягаться с нишей, а где — дешевая синтетика в пафосном стекле.",
            content: `
                <div class="article-header">
                    <span class="article-meta">Обзор • Май 2026 • 8 мин</span>
                    <h1 class="article-title">Арабский восток: парфюмерные сокровища за скромный бюджет</h1>
                </div>
                <div class="article-body">
                    <p>Арабская парфюмерия сегодня переживает настоящий бум. Бренды вроде <em>Lattafa, Afnan, Armaf</em> и <em>Rasasi</em> наводнили рынок. Но за красивыми восточными флаконами часто скрывается полярно разное содержимое. Как отделить зерна от плевел и найти настоящие ольфакторные сокровища без переплат?</p>

                    <h3>Синтетическая атака vs Глубокое раскрытие</h3>
                    <p>Главная беда дешевых арабских духов — агрессивные амбродеревянные материалы (АД). Это те самые «свербящие» ноты, которые пахнут стиральным порошком, медицинским спиртом или жженым сахаром и не отмываются с кожи сутками. Многие бренды используют их, чтобы добиться феноменальной стойкости за копейки.</p>
                    
                    <p>Но среди сотен безликих клонов встречаются уникальные композиции, которые сделаны на уровне дорогой нишевой парфюмерии.</p>

                    <h3>Мои фавориты арабского люкса</h3>
                    <p>После тестирования десятков арабских флаконов я выделил несколько линеек, которые заслуживают места в любой коллекции:</p>
                    <ul>
                        <li><strong>Afnan Supremacy In Oud:</strong> Невероятно глубокий, пряный, сладковатый уд в обрамлении шафрана и лаванды. Обладает мягким, благородным звучанием без намека на аптечную резкость.</li>
                        <li><strong>Lattafa Qaed Al Fursan:</strong> Сочный ананас на подложке из березового дегтя и смолистой пихты. За копейки вы получаете роскошный баланс фруктовой свежести и кожаного дыма.</li>
                        <li><strong>Rasasi Shuhrah:</strong> Аромат-монстр по стойкости. Сухой табачный лист, жесткая кожа и томатная ботва. Звучит невероятно брутально, странно и дорого.</li>
                    </ul>

                    <blockquote>
                        «Арабская парфюмерия учит нас главному правилу парфманьяка: никогда не суди аромат по коробке и цене. Слушай только сам аромат и то, как он раскрывается на твоей коже.»
                    </blockquote>

                    <h3>Совет по разнашиванию</h3>
                    <p>Помните, что арабским ароматам критически важно дать «отстояться». Свежекупленный флакон может звучать плоско и резко. Поставьте его в темный шкаф на месяц — и вы удивитесь, насколько мягче, объемнее и глубже станет звучание.</p>
                </div>
            `
        },
        {
            id: 3,
            category: "theory",
            badge: "Теория",
            date: "Апрель 2026",
            readTime: "5 мин",
            title: "Анатомия кожаных ароматов: от дёгтя до мягкой замши",
            description: "Как создается нота кожи в современной парфюмерии, какие бывают типы кожаных аккордов и почему они так притягательны.",
            content: `
                <div class="article-header">
                    <span class="article-meta">Теория • Апрель 2026 • 5 мин</span>
                    <h1 class="article-title">Анатомия кожаных ароматов: от дёгтя до мягкой замши</h1>
                </div>
                <div class="article-body">
                    <p>Кожаный аккорд — один из самых старых и уважаемых в истории парфюмерии. Интересно, что из самой кожи аромат извлечь невозможно. То, что мы называем «запахом кожи» в парфюмерии — это иллюзия, созданная руками парфюмера. Давайте разберем, из чего строится этот мистический и притягательный аккорд.</p>

                    <h3>Основные направления кожаных ароматов</h3>
                    <p>В парфюмерии выделяют три ключевых кожаных профиля:</p>
                    
                    <h4>1. Русская кожа (Cuir de Russie)</h4>
                    <p>Этот профиль исторически ассоциируется с запахом военных сапог. В его основе лежит <strong>березовый деготь</strong>. Он дает сильный, дымный, дегтярный запах с оттенками копоти и смолы. Это бескомпромиссная, суровая и очень характерная кожа.</p>

                    <h4>2. Испанская кожа</h4>
                    <p>Более мягкая, пряная и роскошная кожа. Исторически кожаные перчатки пропитывали цветочными эссенциями (розой, жасмином) и специями, чтобы скрыть запах дубления. В парфюмерии это направление звучит тепло, сладостно, с тонами корицы, шафрана, сандала и мускуса.</p>

                    <h4>3. Мягкая замша (Suede)</h4>
                    <p>Современное урбанистическое направление. Для создания замшевого эффекта используются синтетические молекулы (например, сукцин) и химические соединения вроде <strong>изобутилхинолина</strong>. Замшевые ароматы звучат чисто, пудрово, мягко, напоминая внутреннюю сторону новой кожаной сумки или перчаток.</p>

                    <blockquote>
                        «Кожаные ароматы обладают уникальной способностью сливаться с запахом тепла человеческой кожи. Они звучат как продолжение вашего собственного тела, создавая ауру дороговизны и интимности.»
                    </blockquote>

                    <h3>С чем сочетают кожу?</h3>
                    <p>Кожа — отличный партнер для специй (шафран придает ей металлический блеск), дерева (уд уводит в восточную роскошь) и цветов (классическое комбо роза + кожа создает невероятный контраст нежности и грубости).</p>
                    <p>If вы только начинаете знакомство с кожей, начните с мягких замшевых или фруктово-кожаных композиций, постепенно переходя к тяжелой дымной классике.</p>
                </div>
            `
        },
        {
            id: 4,
            category: "stories",
            badge: "История",
            date: "Июль 2026",
            readTime: "7 мин",
            title: "История о том, как духи заставили стать безопасными",
            description: "Как дикая парфюмерия 1980-х с тоннами дубового мха и кастореума столкнулась с запретами IFRA, и как лаборатории молекулярной химии изменили саму суть ароматов.",
            content: `
                <div class="article-header">
                    <span class="article-meta">История • Июль 2026 • 7 мин</span>
                    <h1 class="article-title">История о том, как духи заставили стать безопасными</h1>
                </div>
                <div class="article-body">
                    <p>В восьмидесятых парфюмерия была дикой и практически неконтролируемой. Парфюмер был художником: если ему хотелось добавить в формулу килограмм натурального дубового мха, чтобы духи пахли сырым осенним лесом, он это делал. Хотелось добавить кастореум (вещество, получаемое от бобров) для глубокого кожаного шлейфа — пожалуйста.</p>
                    
                    <p>Но постепенно мир захватила идея тотальной безопасности. Появилась организация IFRA — международная парфюмерная ассоциация, которая начала методично тестировать всё, что мы наносим на кожу. Выяснилось, что тот самый дубовый мох — сильнейший аллерген. Натуральный мускус и серую амбру запретили использовать из соображений гуманности к животным.</p>
                    
                    <p>Парфюмерные дома оказались в ловушке. Им законодательно запретили использовать ингредиенты, на которых держались все великие духи прошлого. Представь, что у шеф-повара отобрали соль и сливочное масло и велели приготовить тот же шедевр. Мастерам пришлось переписывать формулы классических ароматов, заменяя запрещенные компоненты на безопасную синтетику. Именно поэтому старые духи, которые ты можешь купить в магазине сегодня, пахнут «уже не так, как при маме».</p>

                    <h3>Как лаборатории победили плантации</h3>
                    <p>Пока экологи и медики запрещали натуральное сырье, химики ковали новое будущее. Парфюмерия сорокалетней давности была плотной, маслянистой и «жирной», потому что состояла преимущественно из натуральных масел. Современная парфюмерия — это триумф молекулярной химии.</p>
                    <p>Крупные химические лаборатории начали синтезировать так называемые «каптивные» молекулы — искусственные ароматические вещества, которые невозможно встретить в природе. Так появились знаменитый Амброксан (имитация серой амбры, которая пахнет чистой теплой кожей и деревом) и Iso E Super (молекула, создающая эффект бархата и объема).</p>
                    <p>Благодаря химии ароматы стали «акварельными». Они больше не душат, в них появилось много воздуха. Современный парфюм не пытается скопировать реальный куст жасмина; он создает абстрактный, футуристичный образ цветка, который никогда не увянет.</p>

                    <h3>Избыточность против политкорректности</h3>
                    <p>Аромат всегда отражает время. В 1980-е в моде был гиперреализм и избыточность: огромные начесы, накладные плечи, кричащие неоновые цвета. Духи должны были соответствовать — они были эгоистичными, громкими и заполняли собой пространство еще до того, как человек входил в комнату. Парфюм заявлял о статусе и поле своего владельца: мужчина пах сурово и брутально, женщина — одурманивающе и сладко.</p>
                    <p>Сегодня мы живем в эпоху открытых офисов, осознанности и политкорректности. Громкий шлейф на работе теперь считается нарушением личных границ. В моду вошел тренд на «ароматы без аромата» — запахи чистоты, дорогого мыла, свежего хлопка или солоноватого морского ветра.</p>
                    <p>К тому же, границы между «мужским» и «женским» стерлись. Современная нишевая парфюмерия почти полностью перешла на формат унисекс. Нам больше не навязывают гендерные роли: если мужчина хочет пахнуть пудровым ирисом, а женщина — сухим табаком и коньяком, индустрия только поддерживает это.</p>

                    <h3>Эпоха фаст-фуда в парфюмерии</h3>
                    <p>И последнее — это скорость и деньги. Раньше великие духи создавались годами, а их запуск становился главным событием десятилетия для модного дома. Сегодня индустрия работает по законам быстрой моды. Крупные бренды штампуют по несколько новинок и фланкеров (вариаций одного аромата) в год.</p>
                    <p>Это изменило и саму структуру запаха. Маркетологи знают: решение о покупке в магазине принимается за первые 30 секунд. Поэтому все силы парфюмеров уходят на «верхушку» аромата — те самые ноты, которые ты слышишь сразу после распыления на блоттер. Они должны быть яркими, коммерческими и понятными. А вот то, как аромат поведет себя через 5 часов, волнует создателей гораздо меньше. Из-за этого многие современные духи в базе кажутся безликими и одинаковыми, в то время как винтажные ароматы раскрывались постепенно, словно хорошая книга, удивляя новыми гранями к концу дня.</p>
                    <blockquote>
                        «Мы потеряли былую монументальность и стойкость, которая въедалась в одежду неделями. Но взамен получили безопасность, невероятное разнообразие концепций и возможность пахнуть так, как не могла пахнуть природа — космической пылью, горячим асфальтом после дождя или свежеотпечатанной бумагой.»
                    </blockquote>
                </div>
            `
        },
        {
            id: 5,
            category: "theory",
            badge: "Теория",
            date: "Июль 2026",
            readTime: "6 мин",
            title: "Парфюмерный траур: почему мы годами ищем «тот самый» аромат",
            description: "Анатомия ольфакторной памяти и эффект Пруста. Разбор с научной точки зрения, почему снятие парфюма переживается как личная потеря.",
            content: `
                <div class="article-header">
                    <span class="article-meta">Теория • Июль 2026 • 6 мин</span>
                    <h1 class="article-title">Парфюмерный траур: почему мы годами ищем «тот самый» аромат, которого больше нет</h1>
                </div>
                <div class="article-body">
                    <p>Каждый, кто увлекается парфюмерией, рано или поздно сталкивается с потерей. Любимый аромат либо полностью снимают с производства, либо его звучание меняется до неузнаваемости. Начинаются долгие поиски остатков во флаконах, скупка винтажей на аукционах и попытки найти дубликаты. Этот феномен в парфюмерном сообществе называют «парфюмерным трауром».</p>
                    <p>Разберемся с точки зрения науки, почему потеря запаха переживается так остро, как мозг нас обманывает и как экологично принять реальность.</p>

                    <h3>Анатомия ольфакторной памяти: почему запахи бьют прямо в сердце</h3>
                    <p>В отличие от зрения и слуха, сигналы от которых сначала проходят через таламус («распределительный щит» мозга) для первичного анализа, обонятельные импульсы идут по другому пути. Ольфакторный сигнал из носовой полости напрямую направляется в лимбическую систему — эволюционно древнюю часть мозга, отвечающую за эмоции и память.</p>
                    <p>Ключевую роль здесь играют две структуры:</p>
                    <ul>
                        <li><strong>Амигдала (миндалевидное тело):</strong> обрабатывает эмоциональные реакции.</li>
                        <li><strong>Гиппокамп:</strong> отвечает за формирование долговременной памяти.</li>
                    </ul>
                    <p>Из-за этой анатомической особенности запахи связываются с воспоминаниями мгновенно и намертво. Этот феномен в психологии называют <strong>«эффектом Пруста»</strong> — когда случайный аромат способен мгновенно воскресить в памяти детали события многолетней давности с той же эмоциональной интенсивностью, что и в прошлом. Теряя аромат, человек подсознательно горюет не по химической формуле во флаконе, а по утерянному доступу к конкретному эмоциональному состоянию (юности, чувству безопасности, первой любви).</p>

                    <h3>Феномен «дорисовывания»: как память искажает реальность</h3>
                    <p>Ольфакторная память человека несовершенна. Наше сознание подвержено эффекту ретроспективного искажения (склонности идеализировать прошлое). Мозг «дорисовывает» старым ароматам качества, которых у них могло не быть:</p>
                    <ul>
                        <li><strong>Эмоциональный фильтр:</strong> Вы помните аромат более глубоким и стойким, потому что в момент его ношения ваш гормональный фон, восприятие и рецепторы были другими. С возрастом количество обонятельных рецепторов снижается, а плотность восприятия запахов падает — это естественный физиологический процесс.</li>
                        <li><strong>Фактор физического старения парфюма:</strong> Если вам удается найти винтажный флакон «того самого» выпуска, он почти гарантированно звучит иначе, чем 15 лет назад. Под воздействием кислорода и света верхние ноты (особенно цитрусовые и легкие цветочные) неизбежно окисляются и разрушаются. Вы сравниваете свои идеализированные воспоминания со стареющей химической жидкостью.</li>
                    </ul>

                    <h3>Как пережить «парфюмерный траур» и двигаться дальше</h3>
                    <p>Попытки найти точную копию снятого аромата в 99% случаев обречены на провал из-за вышеописанных механизмов памяти и физиологии. Чтобы выйти из состояния ольфакторного тупика, психологи и парфюмерные эксперты рекомендуют следующие шаги:</p>
                    <blockquote>
                        <p><strong>1. Признайте замену невозможной.</strong> Перестаньте искать «клон». Примите тот факт, что парфюмерный профиль остался в прошлом вместе с тем жизненным этапом.</p>
                        <p><strong>2. Декомпозируйте старую любовь.</strong> Разложите утерянный аромат на составляющие. Вам нравился не сам флакон, а конкретное сочетание нот (например, сочетание сухой древесины и горьких цитрусов). Ищите эти аккорды в новых, современных релизах, но без привязки к старому имени.</p>
                        <p><strong>3. Формируйте новые ольфакторные якоря.</strong> Вместо попыток вернуть прошлое, создавайте новые воспоминания. Начните знакомиться с современной нишевой парфюмерией. Молекулярная база современных ароматов дает совершенно иную динамику раскрытия, которая может увлечь вас сильнее, чем ностальгический винтаж.</p>
                    </blockquote>
                </div>
            `
        }
    ];

    const articlesGrid = document.getElementById('articles-grid');
    const filterTabs = document.querySelectorAll('.filter-tab');

    // Render articles function
    function renderArticles(filter = 'all') {
        articlesGrid.innerHTML = '';
        
        const filtered = filter === 'all' 
            ? articlesDB 
            : articlesDB.filter(a => a.category === filter);

        if (filtered.length === 0) {
            articlesGrid.innerHTML = '<p class="no-articles">Публикаций в этой категории пока нет...</p>';
            return;
        }

        filtered.forEach(article => {
            const card = document.createElement('article');
            card.className = 'article-card';
            card.setAttribute('data-id', article.id);
            card.innerHTML = `
                <div class="card-badge">${article.badge}</div>
                <div class="card-content">
                    <span class="card-date">${article.date} • ${article.readTime}</span>
                    <h3>${article.title}</h3>
                    <p>${article.description}</p>
                    <span class="read-more-btn">Читать статью →</span>
                </div>
            `;
            
            // Open modal on click
            card.addEventListener('click', () => {
                openReader(article.id);
            });

            articlesGrid.appendChild(card);
        });
    }

    // Tab filtering clicks
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderArticles(tab.getAttribute('data-filter'));
        });
    });

    // Render initially
    renderArticles('all');

    // --- ARTICLE READER MODAL LOGIC ---
    const readerModal = document.getElementById('reader-modal');
    const modalContent = document.getElementById('reader-content-area');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const readerProgress = document.getElementById('reader-progress');

    function openReader(id) {
        const article = articlesDB.find(a => a.id === id);
        if (!article) return;

        modalContent.innerHTML = article.content;
        readerModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
        
        // Reset scroll position and progress
        modalContent.parentElement.scrollTop = 0;
        readerProgress.style.width = '0%';
        
        // Listen to scroll inside the reader body to update progress bar
        const readerBody = modalContent.parentElement;
        readerBody.addEventListener('scroll', updateProgress);
    }

    function closeReader() {
        readerModal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock background scroll
    }

    function updateProgress() {
        const readerBody = modalContent.parentElement;
        const totalHeight = readerBody.scrollHeight - readerBody.clientHeight;
        if (totalHeight > 0) {
            const progress = (readerBody.scrollTop / totalHeight) * 100;
            readerProgress.style.width = `${progress}%`;
        }
    }

    modalCloseBtn.addEventListener('click', closeReader);
    modalBackdrop.addEventListener('click', closeReader);

    // Escape key closes modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && readerModal.classList.contains('active')) {
            closeReader();
        }
    });

    // --- CONTACT FORM SUBMIT ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status-msg');
    const submitBtn = document.getElementById('form-submit-btn');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Disable form and show loader state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        formStatus.textContent = '';
        formStatus.className = 'form-status';

        setTimeout(() => {
            // Simulated response
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить сообщение';
            
            formStatus.textContent = 'Сообщение успешно отправлено! Рам свяжется с вами в ближайшее время.';
            formStatus.classList.add('success');
            
            // Reset inputs
            contactForm.reset();
            
            // Clear message after 5 seconds
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 5000);

        }, 1500);
    });
});
