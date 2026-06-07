import { useState } from 'react';
import { PageHeaderAr } from '../../components/ar/PageHeaderAr';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Search, ChevronDown, ChevronUp, Mail, Phone, MessageCircle, Book, Video } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: '1', category: 'المخزون',
    question: 'كيف أضيف صنفاً جديداً إلى المخزون؟',
    answer: 'انتقل إلى قسم "المخزون" من القائمة الجانبية، ثم انقر على زر "إضافة صنف جديد" في أعلى الصفحة. عبّئ النموذج بالمعلومات المطلوبة وانقر على "إضافة الصنف".',
  },
  {
    id: '2', category: 'الطلبات',
    question: 'ما هي خطوات إنشاء طلب توريد؟',
    answer: 'انتقل إلى "إنشاء طلب" من القائمة، اختر أولوية الطلب ووحدتك، أضف الأصناف المطلوبة مع الكميات، اكتب مبرر الطلب، ثم انقر "إرسال الطلب". سيصل الطلب للمسؤول فوراً.',
  },
  {
    id: '3', category: 'الإشعارات',
    question: 'متى يُرسَل تنبيه المخزون المنخفض؟',
    answer: 'يُرسَل التنبيه تلقائياً عندما تصل كمية أي صنف إلى ما دون الحد الأدنى المحدد في إعدادات النظام. يمكنك تعديل هذا الحد من صفحة "إعدادات النظام".',
  },
  {
    id: '4', category: 'الصلاحيات',
    question: 'ما الفرق بين صلاحية المسؤول ومستخدم الوحدة؟',
    answer: 'المسؤول يملك صلاحيات كاملة: إدارة المخزون، الموافقة على الطلبات، إدارة المستخدمين، والتقارير الشاملة. أما مستخدم الوحدة فيقتصر دوره على استعراض المخزون المتاح وإنشاء طلبات التوريد ومتابعتها.',
  },
  {
    id: '5', category: 'التقارير',
    question: 'كيف أصدّر تقرير المخزون؟',
    answer: 'اذهب إلى صفحة "التقارير والتحليلات"، اختر نوع التقرير والفترة الزمنية، ثم انقر على "تصدير PDF" أو "تصدير Excel" حسب احتياجك.',
  },
  {
    id: '6', category: 'الأمان',
    question: 'ماذا أفعل إذا نسيت كلمة المرور؟',
    answer: 'انقر على رابط "نسيت كلمة المرور؟" في صفحة تسجيل الدخول، أدخل بريدك الإلكتروني المسجل، ستتلقى رسالة تعليمات لإعادة تعيين كلمة المرور.',
  },
];

const guides = [
  { title: 'دليل المسؤول الشامل', desc: 'شرح تفصيلي لجميع وظائف لوحة تحكم المسؤول', icon: Book, color: 'bg-[#4B5B3A]' },
  { title: 'دليل مستخدم الوحدة', desc: 'كيفية إنشاء الطلبات ومتابعة المخزون', icon: Book, color: 'bg-[#6A7B4D]' },
  { title: 'فيديو: جولة في النظام', desc: 'مقدمة مرئية للمنظومة وأهم مميزاتها', icon: Video, color: 'bg-[#C9A961]' },
];

export const HelpPageAr = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filtered = faqs.filter((faq) => {
    const matchSearch = faq.question.includes(searchTerm) || faq.answer.includes(searchTerm);
    const matchCat = activeCategory === 'all' || faq.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <PageHeaderAr
        title="الدعم والمساعدة"
        subtitle="إيجاد الإجابات وحل المشكلات بسرعة وسهولة"
      />

      {/* Search — right-aligned in RTL */}
      <div className="relative max-w-xl mb-8 ml-auto">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="ابحث في الأسئلة الشائعة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-12 text-right"
        />
      </div>

      {/* Quick guides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {guides.map((guide) => {
          const Icon = guide.icon;
          return (
            <button
              key={guide.title}
              className="p-5 bg-card border border-border rounded-2xl hover:shadow-md transition-shadow text-right group"
            >
              <div className={`${guide.color} text-white p-3 rounded-xl inline-block mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{guide.title}</h3>
              <p className="text-sm text-muted-foreground">{guide.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQs */}
        <div className="lg:col-span-2">
          <h2 className="text-right mb-4 text-foreground font-semibold text-lg">الأسئلة الشائعة</h2>

          <div className="flex flex-wrap gap-2 mb-5 justify-end">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#4B5B3A] text-white'
                    : 'bg-card border border-border text-foreground hover:bg-muted'
                }`}
              >
                {cat === 'all' ? 'الكل' : cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((faq) => (
              <div key={faq.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                <button
                  className="w-full p-5 flex items-center justify-between hover:bg-muted/20 transition-colors"
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                >
                  <p className="font-medium text-foreground text-right flex-1 ml-3">{faq.question}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs px-2 py-0.5 bg-muted rounded-lg text-muted-foreground">{faq.category}</span>
                    {openFaq === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                </button>
                {openFaq === faq.id && (
                  <div className="px-5 pb-5 text-right">
                    <p className="text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h2 className="text-right text-foreground font-semibold text-lg">تواصل مع الدعم</h2>

          {[
            { icon: Mail, label: 'البريد الإلكتروني', value: 'support@milstock.local', color: 'bg-[#4B5B3A]' },
            { icon: Phone, label: 'الهاتف المباشر', value: '+966 11 123 4567', color: 'bg-[#6A7B4D]' },
            { icon: MessageCircle, label: 'الدردشة الفورية', value: 'متاح 24/7 للطوارئ', color: 'bg-[#C9A961]' },
          ].map((c) => (
            <Card key={c.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 flex-row-reverse">
                  <div className={`${c.color} text-white p-3 rounded-xl`}>
                    <c.icon className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{c.label}</p>
                    <p className="font-medium text-foreground">{c.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader><CardTitle className="text-right">إرسال رسالة</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="الموضوع" className="text-right" />
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-right resize-none"
                rows={4}
                placeholder="صف مشكلتك بالتفصيل..."
              />
              <Button className="w-full flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                إرسال الرسالة
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

